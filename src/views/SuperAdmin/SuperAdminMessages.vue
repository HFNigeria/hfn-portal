<script setup>
import messagingApi from '@/api/messaging.js';
import userRegister from '@/api/userRegister.js';
import { useAuth } from '@/store/authStore';
import SuperAdminSidebar from '@/views/SuperAdmin/SuperAdminSidebar.vue';
import { computed, onMounted, ref, watch } from 'vue';
const DARK_GREEN = '#004d33';
const LIGHT_GREEN = '#f2f9f3';

const { user } = useAuth();

const currentTab = ref('Direct Messages');
const currentGroup = ref('General');
const currentDMUser = ref('');
const messageInput = ref('');
const directMessages = ref([]);
const chatMessages = ref([]);
const selectedUserId = ref(null);
const contactMessages = ref([]);
const loadingMessages = ref(false);
const groups = ref([]);
const newGroupName = ref('');
const loadingGroups = ref(false);
const allUsers = ref([]);
const userSearchResults = ref([]);
const searchingUsers = ref(false);
const selectedGroupId = ref(null);

const tabs = ['Direct Messages', 'Groups', 'Messages'];
const searchQuery = ref('');

const filteredDMs = computed(() =>
  directMessages.value.filter((dm) =>
    dm.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);


const loadContactMessages = async () => {
  try {
    loadingMessages.value = true;
    contactMessages.value = await userRegister.getContactForm();
  } catch (err) {
    console.error('Failed to load contact messages', err);
  } finally {
    loadingMessages.value = false;
  }
};

const loadGroups = async () => {
  try {
    loadingGroups.value = true;
    const res = await messagingApi.listGroups();

    groups.value = res.results.map((g) => ({
      id: g.id,
      name: g.name,
      count: g.members_count || 0,
    }));
  } catch (err) {
    console.error('Failed to load groups', err);
  } finally {
    loadingGroups.value = false;
  }
};


const createGroup = async () => {
  if (!newGroupName.value.trim()) return;

  try {
    const res = await messagingApi.createGroup({
      name: newGroupName.value,
    });

    groups.value.push({
      id: res.id,
      name: res.name,
      count: 0,
    });

    newGroupName.value = '';
  } catch (err) {
    console.error('Failed to create group', err);
  }
};


const deleteGroup = async (groupId) => {
  try {
    await messagingApi.deleteGroup(groupId);

    groups.value = groups.value.filter(
      (g) => g.id !== groupId
    );
  } catch (err) {
    console.error('Failed to delete group', err);
  }
};


watch(searchQuery, (value) => {
  if (!value.trim()) {
    userSearchResults.value = [];
    return;
  }

  const query = value.toLowerCase();

  userSearchResults.value = allUsers.value.filter((user) =>
    user.first_name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  );
});


watch(currentTab, (tab) => {
  if (tab === 'Messages') {
    loadContactMessages();
  }

  if (tab === 'Groups') {
    loadGroups();
  }
});


const loadConversations = async () => {
  try {
    const res = await messagingApi.getConversations();
    directMessages.value = res.results.map((c) => ({
      id: c.user.id,
      name: c.user.full_name,
      initial: c.user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2),
      count: c.unread_count,
      color: 'bg-green-600',
    }));
  } catch (err) {
    console.error(err);
  }
};

const loadMessages = async (userId) => {
  try {
    const res = await messagingApi.getMessagesWithUser({
      user_id: userId,
    });

    const currentUserId = user.value?.id;

    
    const messages = [...(res.results || [])].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    chatMessages.value = messages.map((m) => {
      const senderName = m.sender === currentUserId ? 'You' : m.sender_name;
      const initial = senderName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2);

      return {
        id: m.id,
        sender: senderName,
        time: new Date(m.created_at).toLocaleTimeString(),
        initial,
        color: m.sender === currentUserId ? 'bg-green-600' : 'bg-gray-500',
        body: m.content,
      };
    });
  } catch (err) {
    console.error(err);
  }
};


const sendMessage = async () => {
  if (!messageInput.value.trim()) return;

  try {
    let res;

    if (currentTab.value === 'Groups' && selectedGroupId.value) {
      res = await messagingApi.sendGroupMessage({
        group_id: selectedGroupId.value,
        content: messageInput.value,
      });
    } else if (selectedUserId.value) {
      res = await messagingApi.sendMessage({
        receiver: selectedUserId.value,
        content: messageInput.value,
      });
    } else {
      return;
    }

    chatMessages.value.push({
      sender: 'You',
      time: new Date(res.created_at).toLocaleTimeString(),
      initial: 'AD',
      color: 'bg-green-600',
      body: res.content,
    });

    messageInput.value = '';

    await loadConversations();

  } catch (err) {
    console.error(err);
  }
};


const isGroupActive = (name) => name === currentGroup.value;
const isDMActive = (dm) => dm.id === selectedUserId.value;

const activeChatTitle = computed(() => {
  if (currentTab.value === 'Groups') {
    return currentGroup.value;
  }
  if (currentTab.value === 'Direct Messages') {
    return currentDMUser.value;
  }
  return '';
});


const loadAllUsers = async () => {
  try {
    searchingUsers.value = true;

    const res = await userRegister.getUserList();

    allUsers.value = res.results || res;

  } catch (err) {
    console.error('Failed to load users', err);
  } finally {
    searchingUsers.value = false;
  }
};


const selectDMUser = async (user) => {
  currentTab.value = 'Direct Messages';

  currentDMUser.value = user.name;
  selectedUserId.value = user.id;

  selectedGroupId.value = null;
  currentGroup.value = '';

  searchQuery.value = '';
  userSearchResults.value = [];

  await loadMessages(user.id);
};


const selectGroup = async (group) => {
  currentTab.value = 'Groups';

  currentGroup.value = group.name;
  selectedGroupId.value = group.id;

  selectedUserId.value = null;
  currentDMUser.value = '';

  await loadGroupMessages(group.id);
};





















const loadGroupMessages = async (groupId) => {
  try {
    const res = await messagingApi.getGroupMessages(groupId);

    const currentUserId = user.value?.id;

    chatMessages.value = res.results
      .map((m) => {
        const isMine = m.sender === currentUserId;

        return {
          id: m.id,
          sender: isMine ? 'You' : (m.sender_name || 'User'),
          time: new Date(m.created_at).toLocaleTimeString(),
          initial: (m.sender_name?.[0] || 'U').toUpperCase(),
          color: isMine ? 'bg-green-600' : 'bg-gray-500',
          body: m.content,
        };
      })
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  await loadAllUsers();
  await loadConversations();
});

const showSidebar = ref(false);
const toggleSidebar = () => (showSidebar.value = !showSidebar.value);
const closeSidebar = () => (showSidebar.value = false);
</script>

<template>
  <div class="flex min-h-screen bg-gray-50 relative">
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
      class="fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:translate-x-0 pt-16 lg:pt-0"
      :class="showSidebar ? 'translate-x-0' : '-translate-x-full'"
    >
      <SuperAdminSidebar @closeSidebar="closeSidebar" class="h-full" />
    </div>

    <div
      v-if="showSidebar"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 z-30 lg:hidden"
      @click="closeSidebar"
    ></div>

    <main class="flex-1 p-8 overflow-auto md:p-8 lg:p-12 pt-10 lg:pt-0">
      <div class="text-sm text-gray-500 mb-6">
        <span class="text-[#006633]">Home</span> > Messages
      </div>
      <div class="flex justify-center w-full items-center mb-8">
        <div class="w-full">
          <div class="mb-16 w-full">
            <div class="w-full px-4 py-4 sm:px-6 rounded-2xl border-2 border-green-100 bg-white shadow-md text-center">
              <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">
                Messages
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div class="border-b border-gray-200 mb-6 max-w-7xl">
        <div class="flex text-lg font-medium">
          <button v-for="tab in tabs" :key="tab" @click="currentTab = tab" class="py-2 px-4 transition border-b-2"
            :class="currentTab === tab
                ? 'font-bold'
                : 'text-gray-500 hover:text-gray-900 border-transparent'
              " :style="currentTab === tab
                ? { color: DARK_GREEN, borderColor: DARK_GREEN }
                : {}
              ">
            {{ tab }}
          </button>
        </div>
      </div>

      <div v-if="currentTab === 'Notifications'" class="space-y-6 max-w-4xl">
        <div v-for="(message, index) in messageNotifications" :key="index"
          class="bg-white p-6 rounded-xl shadow-md border-l-4" :class="{
            'border-green-600': message.category === 'COURSES',
            'border-blue-600': message.category === 'SYSTEM',
            'border-yellow-600': message.category === 'MY ACCOUNT',
            'border-red-600': message.category === 'SUBSCRIPTION',
          }">
          <div class="flex justify-between items-start mb-2">
            <div class="flex items-center space-x-2">
              <svg v-if="message.category === 'COURSES'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="w-5 h-5 text-green-600">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V5H6.5A2.5 2.5 0 0 0 4 7.5v12z" />
              </svg>
              <span class="text-xs font-semibold uppercase tracking-wider" :class="{
                'text-green-600': message.category === 'COURSES',
                'text-blue-600': message.category === 'SYSTEM',
                'text-yellow-600': message.category === 'MY ACCOUNT',
                'text-red-600': message.category === 'SUBSCRIPTION',
              }">
                {{ message.category }}
              </span>
              <div class="w-1 h-1 bg-gray-300 rounded-full"></div>
              <span class="text-xs text-gray-500">{{ message.time }}</span>
            </div>
          </div>
          <p class="text-base font-bold text-gray-900 mb-1">
            {{ message.title }}
          </p>
          <p class="text-sm text-gray-600 line-clamp-2">
            {{ message.body }}
          </p>
        </div>
      </div>

      <div v-if="currentTab === 'Messages'" class="max-w-5xl space-y-4">
        <div v-if="loadingMessages" class="text-center py-12 text-gray-400">
          Loading messages…
        </div>

        <div v-for="msg in contactMessages" :key="msg.id" class="bg-white p-6 rounded-xl shadow border border-gray-100">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="font-semibold text-gray-900">
                {{ msg.name }}
              </p>
              <p class="text-sm text-gray-500">
                {{ msg.email }}
              </p>
            </div>

            <span class="text-xs text-gray-400">
              {{ new Date(msg.created_at).toLocaleString() }}
            </span>
          </div>

          <p class="font-medium text-gray-800 mb-1">
            {{ msg.subject }}
          </p>

          <p class="text-gray-600 whitespace-pre-line">
            {{ msg.message }}
          </p>
        </div>

        <p v-if="!loadingMessages && !contactMessages.length" class="text-center text-gray-400 py-12">
          No contact messages yet
        </p>
      </div>


      <div v-if="currentTab === 'Groups' || currentTab === 'Direct Messages'"
        class="flex flex-col lg:flex-row h-[60vh] lg:h-[80vh] min-h-[400px] lg:min-h-[600px] max-w-7xl border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        <aside class="w-full lg:w-72 bg-white p-4 border-b lg:border-b-0 lg:border-r border-gray-100 flex-shrink-0 overflow-y-auto max-h-32 lg:max-h-none">
          <h2 class="text-xl font-bold text-gray-800 mb-4">
            {{ currentTab }}
          </h2>

          <div v-if="currentTab === 'Direct Messages'" class="space-y-1">

            <div class="relative mb-3">
              <input type="text" v-model="searchQuery" placeholder="Search name or email..."
                class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" />

              <div v-if="userSearchResults.length"
                class="absolute z-20 bg-white border border-gray-200 w-full mt-1 rounded-lg shadow max-h-60 overflow-y-auto">
                <div v-for="user in userSearchResults" :key="user.id" @click="selectDMUser({
                  id: user.id,
                  name: user.first_name + ' ' + user.last_name
                })" class="p-2 hover:bg-gray-50 cursor-pointer text-sm">
                  <p class="font-medium text-gray-800">
                    {{ user.first_name }}
                  </p>
                  <p class="text-xs text-gray-400">
                    {{ user.email }}
                  </p>
                </div>
              </div>

              <div v-if="searchQuery && !userSearchResults.length"
                class="absolute bg-white border border-gray-200 w-full mt-1 rounded-lg shadow p-2 text-sm text-gray-400">
                No user found
              </div>
            </div>
            <div v-if="!searchQuery" class="space-y-1">
  <p class="text-xs text-gray-400 mb-2">Recent Conversations</p>

  <button
    v-for="dm in directMessages"
    :key="dm.id"
    @click="selectDMUser(dm)"
    class="flex items-center justify-between w-full p-2 rounded-lg transition-colors"
    :class="isDMActive(dm) ? 'font-semibold' : 'hover:bg-gray-50 text-gray-600'"
    :style="isDMActive(dm)
      ? { backgroundColor: LIGHT_GREEN, color: DARK_GREEN }
      : {}"
  >
    <div class="flex items-center">
      <div
        class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white mr-3"
        :class="dm.color"
      >
        {{ dm.initial }}
      </div>
      {{ dm.name }}
    </div>

    <span
      v-if="dm.count > 0"
      class="text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full text-white bg-green-700 ml-2"
    >
      {{ dm.count }}
    </span>
  </button>

  <p
    v-if="!directMessages.length"
    class="text-gray-400 text-sm text-center mt-4"
  >
    No conversations yet
  </p>
</div>
          </div>

          <div v-else-if="currentTab === 'Groups'" class="space-y-3">

            <div class="flex space-x-2 mb-3">
              <input v-model="newGroupName" type="text" placeholder="New group name"
                class="flex-grow p-2 border border-gray-300 rounded-lg" />
              <button @click="createGroup" class="px-3 py-2 text-white rounded-lg"
                :style="{ backgroundColor: DARK_GREEN }">
                Add
              </button>
            </div>

            <div v-if="loadingGroups" class="text-sm text-gray-400">
              Loading groups...
            </div>

            <div v-for="group in groups" :key="group.id"
              class="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">

              <button @click="selectGroup(group)" class="flex items-center flex-grow text-left">
                <span>{{ group.name }}</span>
              </button>

              <button @click="deleteGroup(group.id)" class="text-red-500 text-sm hover:text-red-700 ml-2">
                Delete
              </button>

            </div>

          </div>

        </aside>

        <section class="flex-grow flex flex-col bg-white">
          <header class="p-4 border-b border-gray-100">
            <h3 class="text-xl font-semibold text-gray-800">
              {{ activeChatTitle }}
            </h3>
          </header>

          <div class="flex-grow p-6 space-y-4 overflow-y-auto">
            <div class="text-center my-4">
              <span class="text-xs text-gray-400">January 10</span>
            </div>

            <div v-for="message in chatMessages" :key="message.id" class="flex space-x-3">
              <div v-if="message.type === 'file'" class="ml-12 w-full">
                <a href="#"
                  class="inline-flex items-center p-2 text-sm bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  {{ message.file }}
                </a>
              </div>

              <template v-else>
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                  :class="message.color">
                  {{ message.initial }}
                </div>

                <div class="flex flex-col">
                  <p class="text-sm font-semibold text-gray-800">
                    {{ message.sender }}
                    <span class="text-xs font-normal text-gray-400 ml-1">{{
                      message.time
                    }}</span>
                  </p>
                  <p class="text-gray-600 text-base">
                    {{ message.body }}
                  </p>
                </div>
              </template>
            </div>
          </div>

          <footer class="p-4 border-t border-gray-100">
            <div class="flex items-center bg-gray-50 rounded-xl border border-gray-200 pr-2">
              <button class="p-3 text-gray-400 hover:text-gray-600 transition flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                  <path
                    d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19A4 4 0 0 1 18 3.5l-9.19 9.19a2 2 0 0 0 2.83 2.83l8.61-8.61" />
                </svg>
              </button>
              <input type="text" v-model="messageInput" placeholder="Type your message"
                class="flex-grow min-w-0 p-3 bg-transparent focus:outline-none text-gray-700" @keyup.enter="sendMessage" />
               <button @click="sendMessage" class="p-3 text-white rounded-lg transition flex-shrink-0"
                :style="{ backgroundColor: DARK_GREEN }">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 15 2 11 22 2" />
                </svg>
              </button>
            </div>
          </footer>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped></style>
