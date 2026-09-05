<script setup>
import uploadsApi from "@/api/contentUploadsApi";
import eventsApi from "@/api/events.js";
import newsApi from "@/api/newsModule";
import { useAuth } from "@/store/authStore";
import SuperAdminSidebar from "@/views/SuperAdmin/SuperAdminSidebar.vue";
import { computed, onMounted, ref } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();
const events = ref([]);
const loadingEvents = ref(false);
const articles = ref([]);
const editingSlug = ref(null);
const isEditing = computed(() => !!editingSlug.value);
const publishingSlug = ref(null);
const showConfirm = ref(false);
const confirmTitle = ref("");
const confirmMessage = ref("");
const confirmAction = ref(null);
const confirmLoading = ref(false);
const deletingEventSlug = ref(null);
const editingEventSlug = ref(null);
const isEditingEvent = computed(() => !!editingEventSlug.value);
const deletingUploadId = ref("");
const uploading = ref(false);

const isFile = (file) => {
  return (
    typeof window !== "undefined" &&
    typeof File !== "undefined" &&
    file instanceof File
  );
};

const previewUrl = (file) => {
  if (!isFile(file)) return null;
  return URL.createObjectURL(file);
};

const uploadBanner = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  eventForm.value.banner = file;
};
const loading = ref(false);

const editArticle = (article) => {
  editingSlug.value = article.slug;

  newsForm.value = {
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    featured_image: article.featured_image,
    status: article.status,
    audience: article.audience,
    is_featured: article.is_featured ?? false,
    featured_order: article.featured_order ?? 0,
    // videos: article.videos ? [...article.videos] : [],
    videos: (article.videos || []).map((v) =>
      typeof v === "string" ? { media_type: "youtube", youtube_url: v } : v
    ),
    external_link: article.external_link || "",
    is_external: article.is_external ?? false,
    publish_date: article.publish_date
  ? article.publish_date.split("T")[0]
  : "",
  };

  window.scrollTo({ top: 0, behavior: "smooth" });
};

const auth = useAuth();

const visibleArticles = computed(() => {
  return articles.value.filter((article) => {
    if (article.audience === "all") return true;
    return auth.isAuthenticated;
  });
});

const deletingSlug = ref(null);

const deleteArticle = (slug) => {
  confirmTitle.value = "Delete Article";
  confirmMessage.value =
    "Are you sure you want to permanently delete this article? This action cannot be undone.";
  showConfirm.value = true;

  confirmAction.value = async () => {
    try {
      confirmLoading.value = true;
      deletingSlug.value = slug;

      await newsApi.deleteArticle(slug);
      articles.value = articles.value.filter((a) => a.slug !== slug);
    } catch (e) {
      console.error(e);
      console.log("Failed to delete article");
      toast.error("Failed to delete article");
    } finally {
      deletingSlug.value = null;
      confirmLoading.value = false;
      showConfirm.value = false;
    }
  };
};

const handleDeleteUpload = (item) => {
  confirmTitle.value = "Delete Item";
  confirmMessage.value = `Are you sure you want to delete "${item.title}"? This action cannot be undone.`;
  showConfirm.value = true;

  confirmAction.value = async () => {
    try {
      confirmLoading.value = true;
      deletingUploadId.value = item.id || item.slug;

      switch (item.type) {
        case "gallery":
          await uploadsApi.deleteGallery(item.id);
          break;
        case "minute":
          await uploadsApi.deleteMinutes(item.slug);
          break;
        case "newsletter":
          await uploadsApi.deleteNewsletters(item.slug);
          break;
        case "publications":
          await uploadsApi.deletepublications(item.slug);
          break;
        case "video":
          await uploadsApi.deleteVideo(item.slug);
          break;  
        case "document":
          await uploadsApi.deleteDocuments(item.slug);
          break;
        default:
          console.warn("Unknown type", item.type);
          return;
      }

      await fetchUploads();
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error(`Failed to delete ${item.type}`);
      toast.error("Failed to delete item");
    } finally {
      deletingUploadId.value = null;
      confirmLoading.value = false;
      showConfirm.value = false;
    }
  };
};

const fetchArticles = async () => {
  articles.value = await newsApi.listArticles();
};

onMounted(async () => {
  await fetchArticles();
});

const resetNewsForm = () => {
  editingSlug.value = null;
  newsForm.value = {
    title: "",
    excerpt: "",
    content: "",
    featured_image: "",
    status: "draft",
    audience: "all",
    is_featured: false,
    featured_order: 0,
    videos: [],
    external_link: "",
    is_external: false,
    publish_date: "",
  };
};

const publishArticle = async (slug) => {
  const confirmed = confirm("Publish this article?");
  if (!confirmed) return;

  try {
    publishingSlug.value = slug;
    await newsApi.publishArticle(slug);
    await fetchArticles();
  } catch (e) {
    console.error(e);
    console.log("Failed to publish article");
    toast.error("Failed to publish article");
  } finally {
    publishingSlug.value = null;
  }
};

const saveNews = async () => {
  try {
    const formData = new FormData();
    if (!newsForm.value.publish_date) {
  newsForm.value.publish_date = new Date()
    .toISOString()
    .split("T")[0];
}

    Object.entries(newsForm.value).forEach(([key, value]) => {
      if (key === "featured_image") {
        if (isFile(value)) {
          formData.append("featured_image", value);
        }
        return;
      }

      if (key === "content") {
        if (newsForm.value.is_external) {
          formData.append(key, "external link");
        } else {
          formData.append(key, value ?? "");
        }
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((v) => {
          formData.append(`${key}[]`, JSON.stringify(v));
        });
      } else {
        formData.append(key, value ?? "");
      }
    });

    if (isEditing.value) {
      await newsApi.partialUpdateArticle(editingSlug.value, formData);
      toast.success("Article updated");
    } else {
      await newsApi.createArticle(formData);
      toast.success("Article created");
    }

    await fetchArticles();
    resetNewsForm();
  } catch (e) {
    console.error(e);
    toast.error("Failed to save article");
  }
};

const getYoutubeEmbed = (video) => {
  if (!video) return "";

  if (typeof video === "string") {
    return video.replace("watch?v=", "embed/");
  }

  if (video.youtube_url) {
    return video.youtube_url.replace("watch?v=", "embed/");
  }

  return "";
};

const uploadNewsImage = (e) => {
  newsForm.value.featured_image = e.target.files[0];
};

const addVideo = () => {
  if (!videoInput.value) return;

  newsForm.value.videos.push({
    media_type: "youtube",
    youtube_url: videoInput.value,
  });

  videoInput.value = "";
};

const removeVideo = (index) => {
  newsForm.value.videos.splice(index, 1);
};

const newsForm = ref({
  title: "",
  excerpt: "",
  content: "",
  featured_image: "",
  status: "draft",
  audience: "all",
  is_featured: false,
  featured_order: 0,
  videos: [],
  external_link: "",
  is_external: false,
  publish_date: "",
});

const videoInput = ref("");

const eventForm = ref({
  title: "",
  description: "",
  event_type: "webinar",
  status: "upcoming",
  start_datetime: "",
  end_datetime: "",
  location: "",
  audience: "all",
  meeting_url: "",
  max_attendees: null,
  registration_deadline: "",
  is_free: true,
  price: "",
  banner: "",
});

const fetchEvents = async () => {
  loadingEvents.value = true;
  events.value = await eventsApi.listEvents();
  loadingEvents.value = false;
};

const deleteEvent = (event) => {
  confirmTitle.value = "Delete Event";
  confirmMessage.value =
    "Are you sure you want to permanently delete this event? This action cannot be undone.";
  showConfirm.value = true;

  confirmAction.value = async () => {
    try {
      confirmLoading.value = true;
      deletingEventSlug.value = event.slug;

      await eventsApi.deleteEvent(event.slug);
      events.value = events.value.filter((e) => e.slug !== event.slug);
    } catch (e) {
      console.error("Failed to delete event", e);
    } finally {
      deletingEventSlug.value = null;
      confirmLoading.value = false;
      showConfirm.value = false;
    }
  };
};

const editEvent = (event) => {
  editingEventSlug.value = event.slug;

  eventForm.value = {
    title: event.title,
    description: event.description,
    event_type: event.event_type,
    status: event.status,
    start_datetime: event.start_datetime ? event.start_datetime.slice(0, 16) : "",
    end_datetime: event.end_datetime ? event.end_datetime.slice(0, 16) : "",
    location: event.location || "",
    audience: event.audience,
    meeting_url: event.meeting_url || "",
    max_attendees: event.max_attendees,
    registration_deadline: event.registration_deadline ? event.registration_deadline.slice(0, 16) : "",
    is_free: event.is_free ?? true,
    price: event.price || "",
    banner: event.banner_image || "",
  };

  window.scrollTo({ top: 0, behavior: "smooth" });
};

const resetEventForm = () => {
  editingEventSlug.value = null;
  eventForm.value = {
    title: "",
    description: "",
    event_type: "webinar",
    status: "upcoming",
    start_datetime: "",
    end_datetime: "",
    location: "",
    audience: "all",
    meeting_url: "",
    max_attendees: null,
    registration_deadline: "",
    is_free: true,
    price: "",
    banner: "",
  };
};

const createEvent = async () => {
  try {
    const formData = new FormData();

    Object.entries(eventForm.value).forEach(([key, value]) => {
      if (key === "banner" && value instanceof File) {
        formData.append("banner_image", value);
        return;
      }

      if (key === "price") {
        if (!eventForm.value.is_free && value) {
          formData.append("price", Number(value));
        }
        return;
      }

      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value);
      }
    });

    if (isEditingEvent.value) {
      await eventsApi.updateEvent(editingEventSlug.value, formData);
      toast.success("Event updated successfully");
    } else {
      await eventsApi.createCalenderEvent(formData);
      toast.success("Event created successfully");
    }

    await fetchEvents();
    resetEventForm();
  } catch (error) {
    console.error("Create event error");

    const message =
      error.response?.data?.non_field_errors?.[0] ||
      error.response?.data?.error?.message ||
      "Failed to save event";

    toast.error(message);
  }
};

const uploads = ref([]);

const uploadForm = ref({
  title: "",
  type: "newsletter",
  description: "",
  summary: "",
  audience: "all",
  media_type: "image",
  youtube_url: "",
  date: "",
  files: [],
  bannerIndex: 0,
});

const fetchUploads = async () => {
  try {
    const [newsletters, minutes, documents, galleries, publications, videos] =
      await Promise.all([
        uploadsApi.listNewsletters(),
        uploadsApi.getMinutes(),
        uploadsApi.getDocuments(),
        uploadsApi.gallery(),
        uploadsApi.listPublications(),
        uploadsApi.getVideos(),
      ]);

    const normalizedNewsletters = newsletters.map((n) => ({
      id: n.id,
      title: n.title,
      type: "newsletter",
      file: n.file,
      created_at: n.created_at,
      slug: n.slug,
    }));

    const normalizedPublications = publications
      .filter((p) => p.type !== "newsletter")
      .map((n) => ({
        id: n.id,
        title: n.title,
        type: "publications",
        file: n.file,
        created_at: n.created_at,
        slug: n.slug,
      }));

    const normalizedMinutes = minutes.map((m) => ({
      id: m.id,
      title: m.title,
      type: "minute",
      file: m.file,
      created_at: m.created_at,
      slug: m.slug,
    }));

    const normalizedDocuments = documents.map((d) => ({
      id: d.id,
      title: d.title,
      type: "document",
      file: d.file,
      slug: d.slug,
      created_at: d.created_at,
    }));

    const normalizedGalleries = galleries.map((g) => ({
      id: g.id,
      title: g.title,
      type: "gallery",
      file: g.image,
      created_at: g.created_at,
      slug: g.slug,
    }));

    const normalizedVideos = videos.map((v) => ({
      id: v.id,
      title: v.title,
      type: "video",
      file: v.video_file,
      youtube_url: v.youtube_url,
      created_at: v.created_at,
    }));

    uploads.value = [
      ...normalizedNewsletters,
      ...normalizedMinutes,
      ...normalizedDocuments,
      ...normalizedGalleries,
      ...normalizedPublications,
      ...normalizedVideos,
    ];
  } catch (error) {
    console.error("Failed to fetch uploads");
  }
};

const uploadFile = (e) => {
  const selectedFiles = Array.from(e.target.files);
  if (uploadForm.value.type === "gallery") {
    uploadForm.value.files.push(...selectedFiles);
  } else {
    uploadForm.value.files = selectedFiles.slice(0, 1);
  }
};

const fileInputRef = ref(null);

const resetUploadForm = () => {
  uploadForm.value = {
    title: "",
    type: "newsletter",
    description: "",
    summary: "",
    audience: "all",
    media_type: "image",
    youtube_url: "",
    date: "",
    files: [],
    bannerIndex: 0,
  };

  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

const createUpload = async () => {
  if (!uploadForm.value.title) return;

  try {
    uploading.value = true;
    const formData = new FormData();

    formData.append("title", uploadForm.value.title);
    formData.append("summary", uploadForm.value.summary);
    formData.append("audience", uploadForm.value.audience);
    formData.append("media_type", uploadForm.value.media_type);
    formData.append("type", uploadForm.value.type);
    formData.append("date", uploadForm.value.date);

    if (uploadForm.value.type === "video" && uploadForm.value.media_type === "youtube") {
      if (!uploadForm.value.youtube_url) return;
      formData.append("youtube_url", uploadForm.value.youtube_url);
    } else {
      if (!uploadForm.value.files.length) return;

      if (uploadForm.value.type === "gallery") {
        if (uploadForm.value.files.length > 1) {
          uploadForm.value.files.forEach((file) => {
            formData.append("images", file);
          });
        } else {
          formData.append("image", uploadForm.value.files[0]);
        }
        formData.append("banner_index", uploadForm.value.bannerIndex);
      } else {
        // formData.append("file", uploadForm.value.files[0]);
        if (uploadForm.value.type === "video") {
          formData.append("video_file", uploadForm.value.files[0]);
        } else {
          formData.append("file", uploadForm.value.files[0]);
        }
      }
    }

    switch (uploadForm.value.type) {
      // case "gallery":
      //   await uploadsApi.createGallery(formData);
      //   break;
      case "gallery": {
  const res = await uploadsApi.createGallery(formData);

  const galleryId = res?.id;

  if (!galleryId) {
    throw new Error("Gallery ID not returned from createGallery");
  }

  const files = uploadForm.value.files;

  const bannerIndex = uploadForm.value.bannerIndex;

  const extraFiles = files.filter((_, index) => index !== bannerIndex);

  if (extraFiles.length) {
    await Promise.all(
      extraFiles.map((file) => {
        const payload = new FormData();
        payload.append("image", file);

        return uploadsApi.postGalleryItems(galleryId, payload);
      })
    );
  }

  break;
}  

      case "publications":
        await uploadsApi.createPublications(formData);
        break;

      case "newsletter":
        await uploadsApi.createNewsletters(formData);
        break;

      case "minute":
        await uploadsApi.createMinutes(formData);
        break;

      case "video":
        await uploadsApi.createVideo(formData);
        break;  

      case "document":
      default:
        await uploadsApi.create(formData);
    }

    await fetchUploads();
    resetUploadForm();
    toast.success("Upload successful");
  } catch (error) {
    console.error("Upload failed");
    toast.error("Upload failed. Please try again.");
  } finally {
    uploading.value = false;
  }
};

onMounted(() => {
  fetchEvents();
  fetchUploads();
});

const showSidebar = ref(false);
const toggleSidebar = () => (showSidebar.value = !showSidebar.value);
const closeSidebar = () => (showSidebar.value = false);
</script>


<template>
  <div class="flex min-h-screen font-sans relative">
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

    <main class="flex-1 p-6 overflow-auto bg-gray-50">
      <div class="max-w-7xl mx-auto pt-10 lg:pt-0">
        <h1 class="text-2xl font-bold mb-8">Events & Newsletters</h1>

        <section>
          <h2 class="text-xl font-semibold mb-4">
            {{ isEditingEvent ? "Edit Event" : "Create Event" }}
          </h2>

          <div class="grid grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow">
            <input
              v-model="eventForm.title"
              class="input"
              placeholder="Enter Title"
            />
            <select
              v-model="eventForm.event_type"
              class="input"
              placeholder="Select event type"
            >
              <option value="webinar">Webinar</option>
              <option value="workshop">Physical</option>
            </select>

            <select
              v-model="eventForm.audience"
              class="input"
              placeholder="Select audience type"
            >
              <option value="all">All</option>
              <option value="members">Members Only</option>
              <option value="non_members">Non Members Only</option>
            </select>

            <div>
              <label class="text-xs text-gray-500">Start Date & Time</label>
              <input
                type="datetime-local"
                v-model="eventForm.start_datetime"
                class="input"
              />
            </div>
            <div>
              <label class="text-xs text-gray-500">End Date & Time</label>
              <input
                type="datetime-local"
                v-model="eventForm.end_datetime"
                class="input"
              />
            </div>

            <input
              v-model="eventForm.location"
              class="input"
              placeholder="Enter Location"
            />
            <input
              v-model="eventForm.meeting_url"
              class="input"
              placeholder="Meeting URL"
            />

            <input
              type="number"
              v-model="eventForm.max_attendees"
              class="input"
              placeholder="Max attendees"
            />
            <div>
              <label class="text-xs text-gray-500">Registration Deadline</label>
              <input
                type="datetime-local"
                v-model="eventForm.registration_deadline"
                class="input"
              />
            </div>
          </div>

          <textarea
            v-model="eventForm.description"
            class="input mt-4 w-full h-24"
            placeholder="Description"
          ></textarea>

          <div class="mt-4">
            <label class="block mb-2 font-medium text-gray-700"
              >Event Banner</label
            >
            <input
              type="file"
              @change="uploadBanner"
              class="border border-gray-300 rounded-md px-3 py-2 w-full"
            />

            <div v-if="eventForm.banner" class="mt-3">
              <img
                :src="previewUrl(eventForm.banner) || eventForm.banner"
                alt="Event Banner"
                class="h-40 w-full object-cover rounded-md shadow-md"
              />
            </div>
          </div>

          <div class="flex items-center gap-4 mt-4">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="eventForm.is_free" />
              Free Event
            </label>

            <input
              v-if="!eventForm.is_free"
              v-model="eventForm.price"
              class="input"
              placeholder="Price"
            />
          </div>

          <div class="flex gap-3 mt-4">
            <button @click="createEvent" class="btn-primary">
              {{ isEditingEvent ? "Update Event" : "Create Event" }}
            </button>
            <button
              v-if="isEditingEvent"
              @click="resetEventForm"
              class="btn-secondary"
            >
              Cancel
            </button>
          </div>

          <div class="mt-8">
            <h3 class="font-semibold mb-3">Existing Events</h3>

            <div class="overflow-x-auto">
            <table class="w-full text-sm bg-white rounded-xl overflow-hidden">
              <thead class="bg-gray-100 text-left">
                <tr>
                  <th class="p-3">Title</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th class="text-right pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="event in events"
                  :key="event.id"
                  class="border-t hover:bg-gray-50"
                >
                  <td class="p-3 font-medium">{{ event.title }}</td>
                  <td>{{ event.status }}</td>
                  <td>{{ event.event_type }}</td>
                  <td>
                    {{
                      event.start_datetime
                        ? new Date(event.start_datetime).toLocaleDateString()
                        : new Date().toLocaleDateString()
                    }}
                  </td>

                  <td class="text-right pr-3 space-x-2">
                    <button
                      @click="editEvent(event)"
                      class="text-blue-600 hover:underline text-xs"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteEvent(event)"
                      class="text-red-600 hover:underline text-xs"
                      :disabled="deletingEventSlug === event.slug"
                    >
                      {{
                        deletingEventSlug === event.slug
                          ? "Deleting…"
                          : "Delete"
                      }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </section>

        <section class="mt-16">
          <h2 class="text-xl font-semibold mb-4">
            {{ isEditing ? "Edit News Article" : "Create News Article" }}
          </h2>

          <div class="bg-white p-6 rounded-xl shadow space-y-4 max-w-3xl">
            <input v-model="newsForm.title" class="input" placeholder="Title" />
            <input
              v-model="newsForm.excerpt"
              class="input"
              placeholder="Excerpt"
            />
            <div>
  <label class="block mb-2 font-medium text-gray-700">
    Publish Date
  </label>

  <input
    type="date"
    v-model="newsForm.publish_date"
    class="input"
  />

  <p class="text-xs text-gray-500 mt-1">
    Leave empty to use today's date
  </p>
</div>

            <div class="border rounded-lg p-4 bg-gray-50">
              <label class="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  v-model="newsForm.is_external"
                  class="w-4 h-4"
                />
                <span class="font-medium">Link to external article</span>
              </label>

              <div v-if="newsForm.is_external">
                <input
                  v-model="newsForm.external_link"
                  class="input"
                  placeholder="https://example.com/article"
                />
                <p class="text-xs text-gray-500 mt-1">
                  Paste the URL of the external news article
                </p>
              </div>

              <textarea
                v-else
                v-model="newsForm.content"
                class="input h-40"
                placeholder="Full article content"
              />
            </div>

            <div>
              <label class="block mb-2">Featured Image</label>
              <input type="file" @change="uploadNewsImage" />
              <img
                v-if="newsForm.featured_image"
                :src="
                  previewUrl(newsForm.featured_image) || newsForm.featured_image
                "
                class="h-40 mt-2 rounded"
              />
            </div>

            <div class="flex gap-4">
              <select v-model="newsForm.status" class="input">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>

              <select v-model="newsForm.audience" class="input">
                <option value="all">All</option>
                <option value="members">Members only</option>
                <option value="non_members">Non Members Only</option>
              </select>
            </div>

            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                v-model="newsForm.is_featured"
                class="w-4 h-4"
              />
              <span class="font-medium">Featured Article</span>
            </label>

            <div v-if="newsForm.is_featured" class="flex items-center gap-2">
              <input
                v-model.number="newsForm.featured_order"
                type="number"
                class="input"
                placeholder="Display order"
              />
              <p class="text-xs text-gray-500">Lower number appears first</p>
            </div>

            <button @click="saveNews" class="btn-primary">
              {{
                isEditing
                  ? "Update Article"
                  : newsForm.status === "published"
                  ? "Save & Publish"
                  : "Save as Draft"
              }}
            </button>

            <button
              v-if="isEditing"
              @click="resetNewsForm"
              class="btn-secondary ml-2"
            >
              Cancel
            </button>
          </div>
        </section>
        <section class="mt-12">
          <h3 class="text-lg font-semibold mb-4">Existing Articles</h3>

          <div class="bg-white rounded-xl shadow overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-100 text-left">
                <tr>
                  <th class="p-3">Title</th>
                  <th>Status</th>
                  <th>Audience</th>
                  <th>Date</th>
                  <th class="text-right p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="article in articles"
                  :key="article.id"
                  class="border-t hover:bg-gray-50"
                >
                  <td
                    class="p-3 font-medium max-w-xs break-words whitespace-normal"
                  >
                    {{ article.title }}
                  </td>

                  <td>
                    <span
                      class="px-2 py-1 rounded text-xs font-medium"
                      :class="
                        article.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-600'
                      "
                    >
                      {{ article.status }}
                    </span>
                  </td>

                  <td>
                    <span
                      class="px-2 py-1 rounded text-xs font-medium"
                      :class="
                        article.audience === 'all'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-orange-100 text-orange-700'
                      "
                    >
                      {{ article.audience }}
                    </span>
                  </td>

                  <td>
                    {{
                      article.publish_date
                        ? new Date(article.publish_date).toLocaleDateString()
                        : new Date().toLocaleDateString()
                    }}
                  </td>

                  <td class="p-3 text-right space-x-2">
                    <button
                      @click="editArticle(article)"
                      class="text-blue-600 hover:underline text-xs"
                    >
                      Edit
                    </button>

                    <button
                      v-if="article.status === 'draft'"
                      @click="publishArticle(article.slug)"
                      class="text-green-600 hover:underline text-xs"
                      :disabled="publishingSlug === article.slug"
                    >
                      {{
                        publishingSlug === article.slug
                          ? "Publishing…"
                          : "Publish"
                      }}
                    </button>

                    <a
                      v-if="article.is_external && article.external_link"
                      :href="article.external_link"
                      class="text-gray-600 hover:underline text-xs"
                      target="_blank"
                    >
                      View
                    </a>
                    <RouterLink
                      v-else
                      :to="`/blog/${article.slug}`"
                      class="text-gray-600 hover:underline text-xs"
                      target="_blank"
                    >
                      View
                    </RouterLink>

                    <button
                      @click="deleteArticle(article.slug)"
                      class="text-red-600 hover:underline text-xs"
                      :disabled="deletingSlug === article.slug"
                    >
                      {{
                        deletingSlug === article.slug ? "Deleting…" : "Delete"
                      }}
                    </button>
                  </td>
                </tr>

                <tr v-if="!articles.length">
                  <td colspan="5" class="p-6 text-center text-gray-500">
                    No articles created yet
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div class="my-12 flex items-center gap-4">
          <div class="flex-1 h-px bg-gray-300"></div>
          <span class="text-sm text-gray-500">NEWSLETTERS & DOCUMENTS</span>
          <div class="flex-1 h-px bg-gray-300"></div>
        </div>

        <section>
          <h2 class="text-xl font-semibold mb-4">
            Upload Newsletter / Document
          </h2>

          <div class="bg-white p-6 rounded-xl shadow max-w-xl">
            <input
              v-model="uploadForm.title"
              class="input mb-3"
              placeholder="Title"
            />

            <select v-model="uploadForm.type" class="input mb-3">
              <option value="newsletter">Newsletter</option>
              <option value="document">Document</option>
              <option value="gallery">Gallery</option>
              <option value="minute">Minute</option>
              <option value="publications">Publications</option>
              <option value="video">Video</option>  
            </select>

            <select v-model="uploadForm.audience" class="input mb-3">
              <option value="all">All</option>
              <option value="members">Members Only</option>
              <option value="non_members">Non Members Only</option>
            </select>

            <div class="mb-3">
              <label for="upload-date" class="block mb-1 text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                id="upload-date"
                v-model="uploadForm.date"
                type="date"
                class="input"
              />
            </div>

            <textarea
              v-model="uploadForm.summary"
              class="input mb-3"
              placeholder="Description"
            ></textarea>

            <select v-model="uploadForm.media_type" class="input mb-3">
              <option value="image">Upload File</option>
              <option value="youtube">YouTube Video</option>
            </select>

            <input
              v-if="uploadForm.media_type === 'youtube'"
              v-model="uploadForm.youtube_url"
              class="input mb-4"
              placeholder="Paste YouTube link"
            />

            <iframe
              v-for="(video, i) in newsForm.videos"
              :key="i"
              :src="getYoutubeEmbed(video)"
              class="w-full h-40 mt-2"
            />

            <div class="mb-4">
              <input
                type="file"
                @change="uploadFile"
                ref="fileInputRef"
                class="border border-gray-300 rounded-md px-3 py-2 w-full"
                :multiple="uploadForm.type === 'gallery'"
              />

              <div
                v-if="uploadForm.type === 'gallery' && uploadForm.files.length"
                class="mt-4"
              >
                <p class="font-medium mb-2">Gallery Preview (Select Banner)</p>

                <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  <div
                    v-for="(file, index) in uploadForm.files"
                    :key="index"
                    class="relative group"
                  >
                    <img
                      :src="previewUrl(file)"
                      class="h-24 w-full object-cover rounded cursor-pointer border-2 transition"
                      :class="{
                        'border-green-600 scale-105':
                          uploadForm.bannerIndex === index,
                        'border-gray-300': uploadForm.bannerIndex !== index,
                      }"
                      @click="uploadForm.bannerIndex = index"
                    />

                    <button
                      class="absolute top-1 right-1 bg-white text-red-600 rounded-full w-5 h-5 text-xs hidden group-hover:flex items-center justify-center shadow"
                      @click.prevent="uploadForm.files.splice(index, 1)"
                    >
                      ✕
                    </button>

                    <span
                      v-if="uploadForm.bannerIndex === index"
                      class="absolute bottom-1 left-1 text-[10px] bg-green-600 text-white px-2 py-0.5 rounded"
                    >
                      Banner
                    </span>
                  </div>
                </div>

                <p class="text-xs text-gray-500 mt-2">
                  Click an image to set as banner thumbnail
                </p>
              </div>
            </div>

            <div class="flex justify-end mt-4">
              <button
                @click="createUpload"
                class="btn-primary px-6"
                :disabled="uploading"
              >
                {{ uploading ? "Uploading..." : "Upload" }}
              </button>
            </div>
          </div>

          <div class="mt-8">
            <h3 class="font-semibold mb-3">Uploaded Content</h3>

            <div class="overflow-x-auto">
            <table class="w-full text-sm bg-white rounded-xl overflow-hidden">
              <thead class="bg-gray-100 text-left">
                <tr>
                  <th class="p-3">Title</th>
                  <th>Type</th>
                  <th class="p-3">Preview / File</th>
                  <th class="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in uploads"
                  :key="item.id"
                  class="border-t hover:bg-gray-50"
                >
                  <td class="p-3 font-medium">{{ item.title }}</td>
                  <td>
                    <span
                      class="px-2 py-1 rounded text-xs font-medium"
                      :class="{
                        'bg-blue-100 text-blue-700': item.type === 'newsletter',
                        'bg-green-100 text-green-700': item.type === 'minute',
                        'bg-gray-200 text-gray-700': item.type === 'document',
                        'bg-red-100 text-red-700': item.type === 'video',
                        'bg-orange-500 text-gray-100':
                          item.type === 'publications',

                        'bg-purple-100 text-purple-700':
                          item.type === 'gallery',
                      }"
                    >
                      {{ item.type }}
                    </span>
                  </td>

                  <td class="p-3">
                    <!-- IMAGE -->
                    <img
                      v-if="item.file && item.type === 'gallery'"
                      :src="item.file"
                      class="h-16 w-16 object-cover rounded"
                    />

                    <!-- VIDEO -->
                    <iframe
                      v-else-if="item.youtube_url"
                      :src="item.youtube_url.replace('watch?v=', 'embed/')"
                      class="w-32 h-20"
                    ></iframe>

                    <video
                      v-else-if="item.type === 'video' && item.file"
                      :src="item.file"
                      controls
                      class="w-32 h-20 rounded object-cover"
                    ></video>


                    <!-- FILE -->
                    <a
                      v-else-if="item.file"
                      :href="item.file"
                      target="_blank"
                      class="text-primary"
                    >
                      View
                    </a>

                    <span v-else class="text-gray-400">No media</span>
                  </td>
                  <td class="p-3">
                    <!-- <button
                      class="text-red-500 hover:text-red-700 font-semibold text-sm"
                      @click="handleDeleteUpload(item)"
                    >
                      Delete
                    </button> -->
                    <button
                      class="text-red-500 hover:text-red-700 font-semibold text-sm"
                      @click="handleDeleteUpload(item)"
                      :disabled="deletingUploadId === (item.id || item.slug)"
                    >
                      {{
                        deletingUploadId === (item.id || item.slug)
                          ? "Deleting…"
                          : "Delete"
                      }}
                    </button>
                  </td>
                </tr>
                <tr v-if="!uploads.length">
                  <td colspan="3" class="p-6 text-center text-gray-500">
                    No uploads yet
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
  <div
    v-if="showConfirm"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
      <h3 class="text-lg font-semibold mb-2">
        {{ confirmTitle }}
      </h3>

      <p class="text-sm text-gray-600 mb-6">
        {{ confirmMessage }}
      </p>

      <div class="flex justify-end gap-3">
        <button
          @click="showConfirm = false"
          class="btn-secondary"
          :disabled="confirmLoading"
        >
          Cancel
        </button>

        <button
          @click="confirmAction"
          class="btn-danger"
          :disabled="confirmLoading"
        >
          {{ confirmLoading ? "Please wait…" : "Confirm" }}
        </button>
      </div>
    </div>
  </div>
</template>
