<script setup>
import messagingApi from "@/api/messaging";
import userDirectory from "@/api/userDirectory";
import UserSidebar from "@/components/layout/UserSidebar.vue";
import { useAuth } from "@/store/authStore.js";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useToast } from "vue-toastification";

const groupMessagesMap = ref({});

const authStore = useAuth();
const currentUserId = computed(() => authStore.user?.id);

const toast = useToast();
const DARK_GREEN = "#004d33";
const LIGHT_GREEN = "#f2f9f3";

const currentTab = ref("Directory");
const currentDMUser = ref(null);
const showSidebar = ref(false);

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

const closeSidebar = () => {
  showSidebar.value = false;
};

const messageInput = ref("");
const searchQuery = ref("");
let notificationInterval = null;
const currentGroup = ref(null);
const groupMessages = ref([]);

const dmSearch = ref("");

const connectionSearchQuery = ref("");

const filteredConnections = computed(() => {
  const query = connectionSearchQuery.value.trim().toLowerCase();
  if (!query) return connections.value;
  return connections.value.filter(
    (user) =>
      user.name.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
  );
});

const startNewChat = (user) => {
  currentDMUser.value = {
    userId: user.userId || user.id,
    name: user.name,
  };
  currentTab.value = "Direct Messages";
  connectionSearchQuery.value = "";
  fetchMessagesWithUser(currentDMUser.value.userId);
};

const activeChatTitle = computed(() => {
  if (currentTab.value === "Groups") {
    return currentGroup.value?.name || "Select a Group";
  }
  if (currentTab.value === "Direct Messages") {
    return currentDMUser.value?.name || "Select a Conversation";
  }
  return "";
});

const isDMActive = (dm) => {
  return currentDMUser.value && dm.userId === currentDMUser.value.userId;
};

const isLoading = ref({
  directory: false,
  connections: false,
  notifications: false,
  groups: false,
  messages: false,
});

const allConnections = ref([]);
const directoryUsers = ref([]);
const connectionRequests = ref([]);
const connections = ref([]);
const notifications = ref([]);
const groups = ref([]);
const directMessages = ref([]);
const chatMessages = ref([]);
const unreadCount = ref(0);

const directoryPagination = ref({
  count: 0,
  next: null,
  previous: null,
  page: 1,
  pageSize: 20,
  currentLetter: "A",
  currentSearch: "",
});

const tabs = [
  "Directory",
  "Direct Messages",
  "Groups",
  "Notifications",
  "Connections",
];

const fetchDirectoryUsers = async (letter = null, search = "", page = 1) => {
  isLoading.value.directory = true;

  if (letter !== null) {
    directoryPagination.value.currentLetter = letter;
    directoryPagination.value.currentSearch = "";
    searchQuery.value = letter;
  }

  if (search !== undefined && search !== null) {
    directoryPagination.value.currentSearch = search;
  }

  directoryPagination.value.page = page;

  try {
    const params = {
      page: page,
      page_size: directoryPagination.value.pageSize,
    };

    if (directoryPagination.value.currentSearch) {
      params.search = directoryPagination.value.currentSearch;
    } else if (directoryPagination.value.currentLetter) {
      params.letter = directoryPagination.value.currentLetter;
    }

    const response = await userDirectory.listDirectoryUsers(params);

    directoryPagination.value.count = response.count;
    directoryPagination.value.next = response.next;
    directoryPagination.value.previous = response.previous;

    const pendingIds = new Set(
      connectionRequests.value.map((r) => r.fromUserId)
    );

    directoryUsers.value = response.results.map((user) => {
      let status = user.connection_status;

      if (pendingIds.has(user.id)) {
        status = "pending";
      }

      return {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`.trim(),
        email: user.email,
        initial:
          (user.first_name?.[0] || "") + (user.last_name?.[0] || "") || "??",
        profileImage: user.profile_image,
        firstLetter: user.first_letter,
        status,
      };
    });
  } catch (error) {
    console.error("Error fetching directory users");
    toast.error("Failed to load directory users");
  } finally {
    isLoading.value.directory = false;
  }
};

const handleLetterClick = (letter) => {
  searchQuery.value = letter;
  fetchDirectoryUsers(letter, "", 1);
};

const handleSearch = () => {
  const query = searchQuery.value.trim();
  if (query) {
    if (query.length === 1 && /[A-Za-z]/.test(query)) {
      const upperLetter = query.toUpperCase();
      fetchDirectoryUsers(upperLetter, "", 1);
    } else {
      fetchDirectoryUsers(null, query, 1);
    }
  } else {
    fetchDirectoryUsers("A", "", 1);
  }
};

const handleSortBy = (sortType) => {
  fetchDirectoryUsers(
    directoryPagination.value.currentLetter,
    directoryPagination.value.currentSearch,
    1
  );
};

const goToNextPage = () => {
  if (directoryPagination.value.next) {
    fetchDirectoryUsers(
      directoryPagination.value.currentLetter,
      directoryPagination.value.currentSearch,
      directoryPagination.value.page + 1
    );
  }
};

const goToPrevPage = () => {
  if (directoryPagination.value.previous) {
    fetchDirectoryUsers(
      directoryPagination.value.currentLetter,
      directoryPagination.value.currentSearch,
      directoryPagination.value.page - 1
    );
  }
};

const fetchPendingConnections = async () => {
  isLoading.value.connections = true;
  try {
    const response = await messagingApi.getPendingConnections();

    connectionRequests.value = response.map((req) => {
      const isSender = req.sender === currentUserId.value;
      const otherUserId = isSender ? req.receiver : req.sender;

      
      
      
      const name = isSender
  ? req.receiver_name
  : req.sender_name;

      return {
        id: req.id,
        status: req.status,
        name,
        userId: otherUserId,
        initial: name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "U",
        isIncoming: !isSender,
      };
    });
  } catch (error) {
    console.error("Error fetching pending connections");
    toast.error("Failed to load connection requests");
  } finally {
    isLoading.value.connections = false;
  }
};

const fetchConnections = async () => {
  isLoading.value.connections = true;

  try {
    const response = await messagingApi.listConnections();

    allConnections.value = response.results.map((conn) => {
      const isSender = conn.sender === currentUserId.value;

      const otherUserId = isSender ? conn.receiver : conn.sender;
      const otherUserName = isSender ? conn.sender_name : conn.receiver_name;

      return {
        id: conn.id,
        status: conn.status,
        userId: otherUserId,
        name: otherUserName,
    sender: conn.sender,
    receiver: conn.receiver,
        isSender,
        initial:
          otherUserName
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "U",
        position: "Member",
      };
    });

    connections.value = allConnections.value.filter(
      (c) => c.status === "accepted"
    );
  } catch (error) {
    console.error("Error fetching connections");
    toast.error("Failed to load connections");
  } finally {
    isLoading.value.connections = false;
  }
};

const cancelConnectionRequest = async (requestId) => {
  try {
    await messagingApi.cancelConnectionRequest(requestId);
    toast.success("Request cancelled");

    connectionRequests.value = connectionRequests.value.filter(
      (req) => req.id !== requestId
    );
  } catch (error) {
    console.error(error);
    toast.error("Failed to cancel request");
  }
};  

const fetchNotifications = async () => {
  isLoading.value.notifications = true;
  try {
    const response = await messagingApi.listNotifications({
      ordering: "-created_at",
    });
    notifications.value = response.results.map((notif) => ({
      id: notif.id,
      category: notif.notification_type_display || "SYSTEM",
      time: formatTime(notif.created_at),
      title: notif.notification_type_display,
      body: notif.message,
      type: "INFO",
      isRead: notif.is_read,
    }));
  } catch (error) {
    console.error("Error fetching notifications");
    toast.error("Failed to load notifications");
  } finally {
    isLoading.value.notifications = false;
  }
};

const fetchUnreadCount = async () => {
  try {
    const response = await messagingApi.getUnreadCount();
    unreadCount.value = response.count;
  } catch (error) {
    console.error("Error fetching unread count");
  }
};

const fetchGroups = async () => {
  isLoading.value.groups = true;
  try {
    const response = await messagingApi.listGroups();
    const results = response.results || [];

    groups.value = results.map((group) => ({
      id: group.id,
      name: group.name,
      count: 0,
      path: "",
      icon: group.cover_image || "",
      memberCount: group.members_count,
      isMember: group.is_member,
    }));
  } catch (error) {
    console.error("Error fetching groups");
    toast.error("Failed to load groups");
  } finally {
    isLoading.value.groups = false;
  }
};

const fetchConversations = async () => {
  isLoading.value.messages = true;
  try {
    const response = await messagingApi.getConversations();
    directMessages.value = response.map((conv) => ({
      id: conv.other_user_id,
      name: conv.other_user_name || `User ${conv.other_user_id}`,
      initial: conv.other_user_name?.[0] || "U",
      count: conv.unread_count,
      path: `dm-${conv.other_user_id}`,
      color: getRandomColor(),
      userId: conv.other_user_id,
      lastMessage: conv.last_message,
      lastMessageTime: conv.created_at,
    }));
  } catch (error) {
    console.error("Error fetching conversations");
    toast.error("Failed to load conversations");
  } finally {
    isLoading.value.messages = false;
  }
};

const fetchMessagesWithUser = async (userId) => {
  if (!userId) return;

  isLoading.value.messages = true;
  try {
    const response = await messagingApi.getMessagesWithUser({
      user_id: userId,
    });
    const messagesArray = response.results || [];

    const otherName = currentDMUser.value?.name || "User";
    const otherInitial = otherName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2);

    chatMessages.value = messagesArray
      .map((msg) => ({
        id: msg.id,
        senderId: msg.sender,
        sender: msg.sender === currentUserId.value ? "You" : otherName,
        initial: msg.sender === currentUserId.value ? "ME" : otherInitial,
        time: formatTime(msg.created_at),
        color:
          msg.sender === currentUserId.value
            ? "bg-green-700"
            : getColorForUser(msg.sender),
        body: msg.content,
        type: msg.attachment ? "file" : "text",
        isMine: msg.sender === currentUserId.value,
      }))
      .reverse();
  } catch (error) {
    toast.error("Failed to load messages");
  } finally {
    isLoading.value.messages = false;
  }
};

const fetchGroupMessages = async (groupId) => {
  if (!groupId) return;

  isLoading.value.messages = true;
  try {
    const response = await messagingApi.getGroupMessages(groupId);
    const messagesArray = response.results || response;

    groupMessagesMap.value[groupId] = messagesArray
      .map((msg) => ({
        id: msg.id,
        sender: msg.sender_name,
        time: formatTime(msg.created_at),
        initial: (msg.sender_name?.[0] || "U").toUpperCase(),
        color: getColorForUser(msg.sender.id),
        isMine: msg.sender === currentUserId.value,
        body: msg.content,
        type: msg.attachment ? "file" : "text",
        senderId: msg.sender,
      }))
      .reverse();

    chatMessages.value = groupMessagesMap.value[groupId];

    await nextTick();
    const el = document.querySelector(".overflow-y-auto");
    el?.scrollTo({ top: el.scrollHeight });
  } catch {
    console.log("Failed to load group messages");
  } finally {
    isLoading.value.messages = false;
  }
};

const sendConnectionRequest = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is missing");

    await messagingApi.sendConnectionRequest({ receiver_id: userId });
    toast.success("Connection request sent");

    const userIndex = directoryUsers.value.findIndex((u) => u.id === userId);
    if (userIndex > -1) {
      directoryUsers.value[userIndex].status = "pending";
    }
  } catch (error) {
    console.error("Error sending connection request");
    toast.error("Failed to send connection request");
  }
};

const acceptConnectionRequest = async (requestId) => {
  try {
    await messagingApi.acceptConnectionRequest(requestId);
    toast.success("Connection request accepted");
    connectionRequests.value = connectionRequests.value.filter(
      (req) => req.id !== requestId
    );
    await fetchConnections();
    fetchDirectoryUsers(
      directoryPagination.value.currentLetter,
      directoryPagination.value.currentSearch,
      directoryPagination.value.page
    );
  } catch (error) {
    console.error("Error accepting connection request");
    toast.error("Failed to accept connection request");
  }
};

const declineConnectionRequest = async (requestId) => {
  try {
    await messagingApi.declineConnectionRequest(requestId);
    toast.success("Connection request declined");
    connectionRequests.value = connectionRequests.value.filter(
      (req) => req.id !== requestId
    );
    fetchDirectoryUsers(
      directoryPagination.value.currentLetter,
      directoryPagination.value.currentSearch,
      directoryPagination.value.page
    );
  } catch (error) {
    console.error("Error declining connection request");
    toast.error("Failed to decline connection request");
  }
};

const acceptAdminRequest = async (notification) => {
  try {
    await messagingApi.markNotificationAsRead(notification.id);
    toast.success("Admin request accepted");
    notifications.value = notifications.value.filter(
      (n) => n.id !== notification.id
    );
  } catch (error) {
    console.error("Error accepting admin request");
    toast.error("Failed to accept admin request");
  }
};

const removeConnection = async (connectionId) => {
  try {
        const connection = allConnections.value.find(c => c.id === connectionId);
if (!connection || connection.status !== "accepted") {
      toast.error("Invalid connection");
      return;
    }
    await messagingApi.removeConnection(connectionId);
    toast.success("Connection removed");
    fetchConnections();
    fetchDirectoryUsers(
      directoryPagination.value.currentLetter,
      directoryPagination.value.currentSearch,
      directoryPagination.value.page
    );
  } catch {
    toast.error("Failed to remove connection");
  }
};

const declineAdminRequest = async (notification) => {
  try {
    await messagingApi.markNotificationAsRead(notification.id);
    toast.success("Admin request declined");
    notifications.value = notifications.value.filter(
      (n) => n.id !== notification.id
    );
  } catch (error) {
    console.error("Error declining admin request");
    toast.error("Failed to decline admin request");
  }
};

const sendMessage = async () => {
  if (!messageInput.value.trim()) return;

  if (currentTab.value === "Direct Messages") {
    if (!currentDMUser.value?.userId) {
      toast.error("No active conversation");
      return;
    }

    const targetId = currentDMUser.value.userId;

    try {
      await messagingApi.sendMessage({
        recipient: targetId,
        content: messageInput.value,
      });

      messageInput.value = "";

      await fetchMessagesWithUser(targetId);
      await fetchConversations();
    } catch (error) {
      toast.error("Failed to send message");
    }
  }

  if (currentTab.value === "Groups" && currentGroup.value?.id) {
    const groupId = currentGroup.value.id;
    const messageContent = messageInput.value;
    try {
      

      const tempMessage = {
        id: Date.now(),
        sender: "You",
        time: formatTime(new Date()),
        initial: "ME",
        color: "bg-green-700",
        isMine: true,
        body: messageContent,
        type: "text",
        senderId: currentUserId.value,
      };

      if (!groupMessagesMap.value[groupId]) {
        groupMessagesMap.value[groupId] = [];
      }

      groupMessagesMap.value[groupId].push(tempMessage);
      
      chatMessages.value = [...groupMessagesMap.value[groupId]]; 
messageInput.value = "";
      await nextTick();
      const el = document.querySelector(".overflow-y-auto");
      el?.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });

      await messagingApi.sendGroupMessage({
  group_id: groupId,
  content: messageContent,
});

      await fetchGroupMessages(groupId);
    } catch (error) {
        console.error("GROUP SEND ERROR:", error.response?.data || error);
      toast.error("Failed to send group message");
    }
  }
};

const markMessageAsRead = async (messageId) => {
  try {
    await messagingApi.markMessageAsRead(messageId);
  } catch (error) {
    console.error("Error marking message as read");
  }
};

const markNotificationAsRead = async (notificationId) => {
  try {
    await messagingApi.markNotificationAsRead(notificationId);
    const index = notifications.value.findIndex((n) => n.id === notificationId);
    if (index > -1) {
      notifications.value[index].isRead = true;
    }
    fetchUnreadCount();
  } catch (error) {
    console.error("Error marking notification as read");
  }
};

const connectedUserIds = computed(
  () => new Set(connections.value.map((c) => c.userId))
);

const dismissNotification = async (notificationId) => {
  try {
    await messagingApi.deleteNotification(notificationId);

    notifications.value = notifications.value.filter(
      (n) => n.id !== notificationId
    );

    unreadCount.value = Math.max(unreadCount.value - 1, 0);

    toast.success("Notification removed");
  } catch (error) {
    console.error("Error removing notification");
    toast.error("Failed to remove notification");
  }
};

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "";
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
};

const getRandomColor = () => {
  const colors = [
    "bg-orange-500",
    "bg-amber-600",
    "bg-gray-500",
    "bg-blue-500",
    "bg-green-600",
    "bg-purple-500",
    "bg-pink-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getColorForUser = (userId) => {
  const colors = [
    "bg-orange-500",
    "bg-amber-600",
    "bg-gray-500",
    "bg-blue-500",
    "bg-green-600",
    "bg-purple-500",
    "bg-pink-500",
  ];
  const index = userId % colors.length;
  return colors[index];
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const isGroupActive = (group) =>
  currentGroup.value && group.id === currentGroup.value.id;





const pendingRequests = computed(() => {
  return allConnections.value.filter(
    (conn) =>
      conn.status === "pending" &&
      conn.receiver === currentUserId.value 
  );
});  

const activeConnections = computed(() => {
  return allConnections.value.filter((conn) => conn.status === "accepted");
});

const selectDMUser = (dm) => {
  currentDMUser.value = {
    userId: dm.userId,
    name: dm.name,
  };
  currentTab.value = "Direct Messages";
  fetchMessagesWithUser(dm.userId);
};

const fetchUnreadNotifications = async () => {
  const response = await messagingApi.listUnreadNotifications();
  unreadCount.value = response.count ?? response.results.length;
};

const joinGroup = async (group) => {
  try {
    await messagingApi.joinGroup(group.id);

    toast.success(`Joined ${group.name}`);

    await fetchGroups();

  } catch (error) {
    console.error("Join group failed");
    toast.error("Failed to join group");
  }
};

const leaveGroup = async (group) => {
  try {
    await messagingApi.leaveGroup(group.id);

    toast.success(`Left ${group.name}`);

    await fetchGroups();

    if (currentGroup.value?.id === group.id) {
      currentGroup.value = null;
      chatMessages.value = [];
    }

  } catch (error) {
    console.error("Leave group failed");
    toast.error("Failed to leave group");
  }
};
  

const blockConnectionRequest = async (id) => {
  try {
    await messagingApi.blockUser(id);
    toast.success("User blocked");
    connectionRequests.value = connectionRequests.value.filter(
      (r) => r.fromUserId !== id
    );
    fetchDirectoryUsers(
      directoryPagination.value.currentLetter,
      directoryPagination.value.currentSearch,
      directoryPagination.value.page
    );
  } catch {
    toast.error("Failed to block user");
  }
};

const selectGroup = (group) => {
  currentGroup.value = group;
  currentTab.value = "Groups";

  if (groupMessagesMap.value[group.id]) {
    chatMessages.value = groupMessagesMap.value[group.id];
    nextTick(() => {
      const el = document.querySelector(".overflow-y-auto");
      el?.scrollTo({ top: el.scrollHeight });
    });
  } else {
    fetchGroupMessages(group.id);
  }
};

watch(currentTab, (newTab) => {
  switch (newTab) {
    case "Directory":
      fetchDirectoryUsers();
      break;
    case "Connections":
      fetchPendingConnections();
      fetchConnections();
      break;
    case "Notifications":
      fetchNotifications();
      fetchUnreadCount();
      break;
    case "Groups":
      fetchGroups();
      break;
    case "Direct Messages":
      fetchConversations();
      fetchConnections();
      break;
  }
});

onMounted(async () => {
  await fetchPendingConnections();
  fetchDirectoryUsers("A");
  fetchUnreadCount();

  notificationInterval = setInterval(() => {
    if (currentTab.value === "Notifications") {
      fetchNotifications();
    }
    fetchUnreadCount();
  }, 30000);
});

onUnmounted(() => {
  if (notificationInterval) {
    clearInterval(notificationInterval);
  }
});
</script>

<template>
  <div class="relative flex min-h-screen bg-gray-50">
    <button
      @click="toggleSidebar"
      class="lg:hidden fixed top-20 right-4 z-50 bg-[#004d33] text-white p-2 rounded-md shadow-md"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <div
      v-if="showSidebar"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 z-30 lg:hidden"
      @click="closeSidebar"
    ></div>

    <div
      :class="[
        'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 w-72 max-w-full lg:static lg:translate-x-0 lg:w-64 lg:min-h-screen',
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <UserSidebar @closeSidebar="closeSidebar" />
    </div>

    <main class="flex-1 p-4 md:p-8 lg:p-12">
      <div class="flex justify-center w-full items-center mb-8">
        <div class="w-full">
          <div class="mb-16 w-full">
            <div
              class="w-full px-4 py-4 sm:px-6 rounded-2xl border-2 border-green-100 bg-white shadow-md text-center"
            >
              <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">
                Messages
                <span
                  v-if="unreadCount > 0"
                  class="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full"
                >
                  {{ unreadCount }}
                </span>
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center w-full">
        <div class="border-b border-gray-200 mb-6 max-w-7xl w-full">
          <div class="flex text-lg font-medium justify-center flex-wrap">
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="currentTab = tab"
              class="py-2 px-3 sm:px-4 transition border-b-2 text-sm sm:text-base"
              :class="
                currentTab === tab
                  ? 'font-bold'
                  : 'text-gray-500 hover:text-gray-900 border-transparent'
              "
              :style="
                currentTab === tab
                  ? { color: DARK_GREEN, borderColor: DARK_GREEN }
                  : {}
              "
            >
              {{ tab }}
              <span
                v-if="tab === 'Notifications' && unreadCount > 0"
                class="ml-1 text-xs bg-red-500 text-white rounded-full px-1"
              >
                {{ unreadCount }}
              </span>
            </button>
          </div>
        </div>
      </div>

      
      <div v-if="isLoading[currentTab.toLowerCase()]" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d33]"
        ></div>
        <p class="mt-4 text-gray-600">
          Loading {{ currentTab.toLowerCase() }}...
        </p>
      </div>

      <div v-else>
        <div
          v-if="currentTab === 'Directory'"
          class="max-w-7xl bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div class="relative w-full max-w-sm">
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                type="text"
                placeholder="Search by name or email..."
                class="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-700 mr-2">Show</span>
              <select
                v-model="directoryPagination.pageSize"
                @change="
                  fetchDirectoryUsers(
                    directoryPagination.currentLetter,
                    directoryPagination.currentSearch,
                    1
                  )
                "
                class="p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              >
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </select>
            </div>
          </div>

          <div
            class="flex flex-wrap justify-start gap-1 p-2 bg-gray-50 rounded-lg mb-6 border border-gray-200"
          >
            <button
              v-for="letter in alphabet"
              :key="letter"
              @click="handleLetterClick(letter)"
              class="w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-lg transition-all"
              :class="{
                'bg-green-100 text-gray-800 border border-green-300':
                  directoryPagination.currentLetter === letter &&
                  !directoryPagination.currentSearch,
                'text-gray-500 hover:bg-gray-100':
                  directoryPagination.currentLetter !== letter ||
                  directoryPagination.currentSearch,
              }"
              :style="
                directoryPagination.currentLetter === letter &&
                !directoryPagination.currentSearch
                  ? {
                      borderColor: DARK_GREEN,
                      backgroundColor: LIGHT_GREEN,
                      color: DARK_GREEN,
                    }
                  : {}
              "
            >
              {{ letter }}
            </button>
          </div>

          <div v-if="isLoading.directory" class="text-center py-8">
            <div
              class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#004d33]"
            ></div>
            <p class="mt-2 text-gray-600">Loading users...</p>
          </div>

          <div v-else>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-h-[200px] max-h-[60vh] overflow-y-auto"
            >
              <div
                v-for="(user, index) in directoryUsers"
                :key="index"
                class="py-2 px-3 border-l-4 border-green-500 flex flex-col justify-center hover:bg-gray-50 rounded-lg transition"
              >
                <div class="flex items-center mb-2">
                  <div
                    v-if="user.profileImage"
                    class="w-10 h-10 rounded-full overflow-hidden mr-3"
                  >
                    <img
                      :src="user.profileImage"
                      :alt="user.name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    v-else
                    class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold mr-3"
                  >
                    {{ user.initial }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-800">
                      {{ user.name }}
                    </p>
                    <p class="text-xs text-gray-500">{{ user.email }}</p>
                  </div>
                </div>

                <div class="mt-2">
                  <span
                    v-if="connectedUserIds.has(user.id)"
                    class="text-xs px-3 py-1 border border-green-600 text-green-600 rounded-full bg-green-50 inline-block"
                  >
                    Connected
                  </span>
                  <button
                    v-else-if="user.status === 'none'"
                    @click="sendConnectionRequest(user.id)"
                    class="text-xs px-3 py-1 border border-green-600 text-green-600 rounded-full hover:bg-green-50 transition"
                  >
                    Request to Connect
                  </button>
                  <span
                    v-else-if="user.status === 'pending'"
                    class="text-xs px-3 py-1 border border-amber-600 text-amber-600 rounded-full bg-amber-50 inline-block"
                  >
                    Request Pending
                  </span>

                  <span
                    v-else-if="user.status === 'declined'"
                    class="text-xs px-3 py-1 border border-red-600 text-red-600 rounded-full bg-red-50 inline-block"
                  >
                    Request Declined
                  </span>
                  <span v-else class="text-xs text-gray-500">
                    {{ user.status }}
                  </span>
                </div>
              </div>
            </div>

            <div
              v-if="directoryUsers.length > 0"
              class="mt-6 flex justify-between items-center"
            >
              <div>
                <span class="text-sm text-gray-500">
                  Showing
                  {{
                    (directoryPagination.page - 1) *
                      directoryPagination.pageSize +
                    1
                  }}
                  to
                  {{
                    Math.min(
                      directoryPagination.page * directoryPagination.pageSize,
                      directoryPagination.count
                    )
                  }}
                  of {{ directoryPagination.count }} users
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="goToPrevPage"
                  :disabled="!directoryPagination.previous"
                  class="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span class="text-sm text-gray-600">
                  Page {{ directoryPagination.page }}
                </span>
                <button
                  @click="goToNextPage"
                  :disabled="!directoryPagination.next"
                  class="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>

            <div v-else class="text-center py-12 text-gray-500">
              <p>No users found</p>
              <p v-if="directoryPagination.currentSearch" class="text-sm mt-2">
                No results for "{{ directoryPagination.currentSearch }}"
              </p>
              <p v-else class="text-sm mt-2">
                No users found starting with "{{
                  directoryPagination.currentLetter
                }}"
              </p>
            </div>
          </div>
        </div>

        <div v-if="currentTab === 'Notifications'" class="space-y-6 max-w-4xl">
          <div
            v-for="(message, index) in notifications"
            :key="index"
            class="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4"
            :class="{
              'border-green-600': message.category === 'COURSES',
              'border-blue-600': message.category === 'SYSTEM',
              'border-yellow-600': message.category === 'MY ACCOUNT',
              'border-red-600': message.category === 'SUBSCRIPTION',
              'border-purple-600': message.category === 'ADMIN',
              'opacity-75': message.isRead,
            }"
          >
            <div class="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
              <div class="flex items-center flex-wrap gap-x-2">
                <svg
                  v-if="message.category === 'COURSES'"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-5 h-5 text-green-600"
                >
                  <path
                    d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V5H6.5A2.5 2.5 0 0 0 4 7.5v12z"
                  />
                </svg>
                <svg
                  v-if="message.category === 'ADMIN'"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-5 h-5 text-purple-600"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <polyline points="17 11 19 13 23 9" />
                </svg>
                <span
                  class="text-xs font-semibold uppercase tracking-wider"
                  :class="{
                    'text-green-600': message.category === 'COURSES',
                    'text-blue-600': message.category === 'SYSTEM',
                    'text-yellow-600': message.category === 'MY ACCOUNT',
                    'text-red-600': message.category === 'SUBSCRIPTION',
                    'text-purple-600': message.category === 'ADMIN',
                  }"
                >
                  {{ message.category }}
                </span>
                <div class="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span class="text-xs text-gray-500">{{ message.time }}</span>
              </div>
              <div class="flex space-x-2 flex-shrink-0">
                <button
                  @click="markNotificationAsRead(message.id)"
                  class="text-xs text-gray-400 hover:text-gray-600 whitespace-nowrap"
                >
                  Mark as read
                </button>
                <button
                  @click="dismissNotification(message.id)"
                  class="text-xs text-gray-400 hover:text-gray-600 whitespace-nowrap"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <p class="text-base font-bold text-gray-900 mb-1">
              {{ message.title }}
            </p>
            <p class="text-sm text-gray-600 line-clamp-2">
              {{ message.body }}
            </p>
            <div v-if="message.type === 'ACTION'" class="mt-4 flex space-x-3">
              <button
                @click="acceptAdminRequest(message)"
                class="px-4 py-2 text-sm font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition shadow-md"
              >
                Accept
              </button>
              <button
                @click="declineAdminRequest(message)"
                class="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Decline
              </button>
            </div>
          </div>

          <div
            v-if="notifications.length === 0"
            class="text-center py-12 text-gray-500"
          >
            <p>No notifications yet</p>
          </div>
        </div>

        <div
          v-else-if="currentTab === 'Connections'"
          class="max-w-7xl bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            Connection Requests
            <span
              v-if="pendingRequests.length > 0"
              class="ml-2 px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full"
            >
              {{ pendingRequests.length }} Pending
            </span>
          </h3>

            <div v-if="pendingRequests.length > 0" class="space-y-3 mb-10">
            <div
              v-for="request in pendingRequests"
              :key="request.id"
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm"
            >
              <div class="flex items-center space-x-3">
                <div
                  v-if="request.profileImage"
                  class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
                >
                  <img
                    :src="request.profileImage"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div
                  v-else
                  class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-lg font-bold text-amber-700 flex-shrink-0"
                >
                  {{ request.initial }}
                </div>

                <div>
                  <p class="text-base font-bold text-gray-900 leading-tight">
                    {{ request.name }}
                  </p>
                  <p class="text-xs text-gray-500 italic">
                    {{ request.name }} wants to connect.
                  </p>
                </div>
              </div>

              <div
                v-if="request.status?.toLowerCase() === 'pending'"
                class="flex items-center space-x-4"
              >
                
<div v-if="!request.isSender">
  <button @click="declineConnectionRequest(request.id)">Decline</button>
  <button @click="acceptConnectionRequest(request.id)">Accept</button>
</div>


<div v-else>
  <button @click="cancelConnectionRequest(request.id)">
    Cancel Request
  </button>
</div>
              </div>
            </div>
          </div>

          <div
            v-else
            class="py-8 text-center border-2 border-dashed border-gray-100 rounded-xl mb-10"
          >
            <p class="text-gray-400">No pending connection requests.</p>
          </div>

          <hr class="my-8 border-gray-100" />

          <h3 class="text-xl font-bold text-gray-800 mb-4">
            My Connections ({{ activeConnections.length }})
          </h3>

          <div v-if="activeConnections.length > 0" class="space-y-3">
            <div
              v-for="connection in activeConnections"
              :key="connection.id"
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm"
            >
              <div class="flex items-center space-x-3">
                <div
                  v-if="connection.profileImage"
                  class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
                >
                  <img
                    :src="connection.profileImage"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div
                  v-else
                  class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-lg font-bold text-green-700 flex-shrink-0"
                >
                  {{ connection.initial }}
                </div>

                <div>
                  <p class="text-base font-bold text-gray-900 leading-tight">
                    {{ connection.name }}
                  </p>
                  <div class="flex items-center">
                    <span
                      class="w-2 h-2 bg-green-500 rounded-full mr-1.5"
                    ></span>
                    <span class="text-xs text-gray-500">Connected with {{ connection.name }}</span>
                  </div>
                </div>
              </div>

              <button
                @click="removeConnection(connection.id)"
                class="text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>

          <div v-else class="py-12 text-center bg-gray-50 rounded-xl">
            <p class="text-gray-500">You haven't added any connections yet.</p>
          </div>
        </div>
        <div
          v-if="currentTab === 'Groups' || currentTab === 'Direct Messages'"
          class="flex flex-col lg:flex-row h-[80vh] min-h-[400px] lg:min-h-[600px] max-w-7xl border border-gray-200 rounded-xl shadow-lg overflow-hidden"
        >
          <aside
            class="w-full lg:w-84 bg-white p-4 border-r border-gray-100 flex-shrink-0 overflow-y-auto"
          >
            <h2 class="text-xl font-bold text-gray-800 mb-4">
              {{ currentTab }}
            </h2>

            <div v-if="currentTab === 'Direct Messages'" class="space-y-1">
              <input
                v-model="connectionSearchQuery"
                placeholder="Search connections..."
                class="w-full mb-3 p-2 border rounded"
              />

              <button
                v-if="filteredConnections.length > 0"
                v-for="user in filteredConnections"
                :key="user.userId"
                @click="startNewChat(user)"
                class="flex items-center w-full p-2 rounded-lg hover:bg-gray-50"
              >
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white mr-3"
                  :class="getColorForUser(user.userId)"
                >
                  {{ user.initial }}
                </div>
                <div class="truncate">{{ user.name }}</div>
                <span
                  v-if="user.count > 0"
                  class="text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full text-white bg-green-700"
                >
                  {{ user.count }}
                </span>
              </button>
              <div
                v-if="filteredConnections.length === 0"
                class="text-center py-4 text-gray-500"
              >
                <p class="text-sm">No matching connections found</p>
              </div>

              <button
                v-else
                v-for="dm in directMessages"
                :key="dm.userId"
                @click="selectDMUser(dm)"
                class="flex items-center justify-between w-full p-2 rounded-lg transition-colors"
                :class="
                  isDMActive(dm)
                    ? 'font-semibold'
                    : 'hover:bg-gray-50 text-gray-600'
                "
                :style="
                  isDMActive(dm)
                    ? { backgroundColor: LIGHT_GREEN, color: DARK_GREEN }
                    : {}
                "
              >
                <div class="flex items-center">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white mr-3"
                    :class="dm.color"
                  >
                    {{ dm.initial }}
                  </div>
                  <div class="truncate">{{ dm.name }}</div>
                </div>

                <span
                  v-if="dm.count > 0"
                  class="text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full text-white bg-green-700"
                >
                  {{ dm.count }}
                </span>
              </button>

              <div
                v-if="directMessages.length === 0"
                class="text-center py-4 text-gray-500"
              >
                <p class="text-sm">No conversations yet</p>
              </div>
            </div>

            <div v-else-if="currentTab === 'Groups'" class="space-y-1">
              <div
  v-for="group in groups"
  :key="group.id"
  class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
>
  
  <button
    @click="selectGroup(group)"
    class="flex items-center truncate flex-1 text-left"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-4 h-4 mr-2"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <line x1="16" y1="3" x2="8" y2="21"></line>
      <line x1="21" y1="8" x2="3" y2="16"></line>
    </svg>

    <span class="truncate">{{ group.name }}</span>
  </button>

  
  <button
    v-if="!group.isMember"
    @click.stop="joinGroup(group)"
    class="text-xs px-3 py-1 rounded bg-green-600 text-white"
  >
    Join
  </button>

  <button
    v-else
    @click.stop="leaveGroup(group)"
    class="text-xs px-3 py-1 rounded bg-red-500 text-white"
  >
    Leave
  </button>
</div>
              <div
                v-if="groups.length === 0"
                class="text-center py-4 text-gray-500"
              >
                <p class="text-sm">No groups yet</p>
              </div>
            </div>
          </aside>

          <section class="flex-grow flex flex-col bg-white">
            <header class="p-4 border-b border-gray-100">
              <h3 class="text-xl font-semibold text-gray-800 truncate">
                {{ activeChatTitle }}
              </h3>
            </header>

            <div class="flex-grow p-6 space-y-4 overflow-y-auto">
              <div class="text-center my-4">
                <span class="text-xs text-gray-400">{{
                  new Date().toLocaleDateString()
                }}</span>
              </div>

              <div
                v-if="chatMessages.length === 0"
                class="text-center py-12 text-gray-500"
              >
                <p>No messages yet. Start the conversation!</p>
              </div>

              <div
                v-for="message in chatMessages"
                :key="message.id"
                class="flex"
                :class="message.isMine ? 'justify-end' : 'justify-start'"
              >
                <div
                  class="max-w-[70%] p-3 rounded-xl"
                  :class="
                    message.isMine
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  "
                >
                  <p class="text-sm">{{ message.body }}</p>
                  <span class="text-xs opacity-70 block mt-1 text-right">
                    {{ message.time }}
                  </span>
                </div>
              </div>
            </div>

            <footer class="p-4 border-t border-gray-100">
              <div
                class="flex items-center bg-gray-50 rounded-xl border border-gray-200 pr-2"
              >
                <button
                  class="p-3 text-gray-400 hover:text-gray-600 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-5 h-5"
                  >
                    <path
                      d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19A4 4 0 0 1 18 3.5l-9.19 9.19a2 2 0 0 0 2.83 2.83l8.61-8.61"
                    />
                  </svg>
                </button>
                <input
                  type="text"
                  v-model="messageInput"
                  @keyup.enter="sendMessage"
                  placeholder="Type your message"
                  class="flex-grow p-3 bg-transparent focus:outline-none text-gray-700"
                />
                <button
                  @click="sendMessage"
                  :disabled="!messageInput.trim()"
                  class="p-3 text-white rounded-lg transition"
                  :class="{
                    'opacity-50 cursor-not-allowed': !messageInput.trim(),
                  }"
                  :style="{
                    backgroundColor: messageInput.trim() ? DARK_GREEN : '#ccc',
                  }"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-5 h-5"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 15 2 11 22 2" />
                  </svg>
                </button>
              </div>
            </footer>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
