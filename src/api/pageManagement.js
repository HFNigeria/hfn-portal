import api from './axios.js';

const normalizePageType = (pageType) =>
  String(pageType ?? '').replace(/^\/+|\/+$/g, '');

export default {
  async listPages() {
    try {
      const response = await api.get('/pages/');
      return response.data;
    } catch (error) {
      console.error('List Pages API error');
      throw error;
    }
  },

  async getPageByType(pageType) {
    try {
      const normalizedPageType = normalizePageType(pageType);
      const response = await api.get(`/pages/${normalizedPageType}/`);
      return response.data;
    } catch (error) {
      console.error('Get Page By Type API error');
      throw error;
    }
  },

  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/uploads/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = response.data ?? {};
      const url = data.url || data.file_url || data.file || data.image || data.location;
      if (!url || typeof url !== 'string') {
        throw new Error('Upload response did not include a file URL');
      }
      return { url, ...data };
    } catch (error) {
      console.error('Image upload API error', error?.response?.data ?? error);
      throw error;
    }
  },

  async createPage(payload) {
    try {
      const response = await api.post('/pages/', payload);
      return response.data;
    } catch (error) {
      console.error('Create Page API error');
      throw error;
    }
  },

  async updatePage(pageType, payload) {
    try {
      const response = await api.put(`/pages/${normalizePageType(pageType)}/`, payload);
      return response.data;
    } catch (error) {
      console.error('Update Page API error');
      throw error;
    }
  },

  async partialUpdatePage(pageType, payload) {
    try {
      const response = await api.patch(`/pages/${normalizePageType(pageType)}/`, payload);
      return response.data;
    } catch (error) {
      console.error('Partial Update Page API error');
      throw error;
    }
  },

  async publishPage(pageType) {
    try {
      const response = await api.post(`/pages/${normalizePageType(pageType)}/publish/`, {});
      return response.data;
    } catch (error) {
      console.error('Publish Page API error');
      throw error;
    }
  },

  async updatePageVisibility(pageType, isVisible) {
    try {
      const response = await api.patch(`/pages/${normalizePageType(pageType)}/visibility/`, {
        is_visible: isVisible,
      });
      return response.data;
    } catch (error) {
      console.error('Page Visibility API error');
      throw error;
    }
  },

  async deletePage(slug) {
    try {
      const response = await api.delete(`/pages/${normalizePageType(slug)}/`);
      return response.data;
    } catch (error) {
      console.error('Delete Page API error');
      throw error;
    }
  },
};
