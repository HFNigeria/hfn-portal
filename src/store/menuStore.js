import axios from "axios";
import { computed, ref } from "vue";
import { menuSchema } from "@/schemas/menu.schema.js";

const STORAGE_KEY = "hfn_custom_menus";

const loadStoredMenus = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persistMenus = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customMenus.value));
};

const customMenus = ref(loadStoredMenus());
const apiMenus = ref([]);
const isLoaded = ref(false);

const slugToPath = (slugSource) =>
  `/${String(slugSource ?? "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^\/+/, "")}`;

export function useMenuStore() {
  const addMenuItem = (item) => {
    if (!item?.title || !item?.path || !item?.group) return;
    const entry = {
      title: item.title,
      path: item.path,
      group: item.group,
      external: item.external ?? false,
    };
    const existing = customMenus.value.findIndex((m) => m.path === entry.path);
    if (existing >= 0) {
      customMenus.value[existing] = entry;
    } else {
      customMenus.value.push(entry);
    }
    persistMenus();
  };

  const removeMenuItem = (path) => {
    customMenus.value = customMenus.value.filter((m) => m.path !== path);
    persistMenus();
  };

  const syncPageMenu = ({ name, slug, menu }) => {
    const path = slugToPath(slug || name);
    if (menu) {
      addMenuItem({ title: name, path, group: menu });
    } else {
      removeMenuItem(path);
    }
  };

  const loadApiMenus = async () => {
    try {
      const publicApi = axios.create({
        baseURL: "https://hfn-backend-production.up.railway.app/api",
        timeout: 15000,
      });
      const res = await publicApi.get("/pages/");
      const rawPages = res.data || [];
      apiMenus.value = rawPages
        .filter((p) => p.is_visible)
        .map((p) => ({
          title: p.name,
          path: slugToPath(p.slug || p.name),
          group: p.content?._menu || p.menu || null,
        }))
        .filter((p) => p.group);
      isLoaded.value = true;
    } catch (e) {
      console.warn("Failed to load dynamic nav pages", e);
    }
  };

  const navLinks = computed(() => {
    const links = structuredClone(menuSchema.staticLinks);
    const addTop = [];
    const addTo = {
      about: [],
      news: [],
      membership: [],
    };

    const seen = new Set();
    const allDynamic = [...apiMenus.value, ...customMenus.value];
    for (const page of allDynamic) {
      if (seen.has(page.path)) continue;
      seen.add(page.path);
      if (page.group === "top") {
        addTop.push({
          title: page.title,
          path: page.path,
          hasDropdown: false,
          external: page.external,
        });
      } else if (addTo[page.group]) {
        addTo[page.group].push({
          title: page.title,
          path: page.path,
          external: page.external,
        });
      }
    }

    const merged = [];

    for (const link of links) {
      const key = link.title.toLowerCase();
      if (key === "about us") {
        link.dropdownItems = [...(link.dropdownItems ?? []), ...addTo.about];
      } else if (key === "news & updates") {
        link.dropdownItems = [...(link.dropdownItems ?? []), ...addTo.news];
      } else if (key === "membership") {
        link.dropdownItems = [...(link.dropdownItems ?? []), ...addTo.membership];
      }
      merged.push(link);
      if (key === "contact us") {
        merged.push(...addTop);
      }
    }

    return merged;
  });

  return {
    customMenus,
    isLoaded,
    navLinks,
    addMenuItem,
    removeMenuItem,
    syncPageMenu,
    loadApiMenus,
  };
}
