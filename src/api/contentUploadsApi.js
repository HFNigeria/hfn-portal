import api from './axios.js'; 

export default {

 async getVideos(params = {}) {
    try {
      const { data } = await api.get('/media/videos/', {
        params,
      });

      return data;
    } catch (error) {
      console.error('List videos error');
      throw error;
    }
  },

  
  async getSingleVideo(slug) {
    try {
      const { data } = await api.get(
        `/media/videos/${slug}/`
      );

      return data;
    } catch (error) {
      console.error('Retrieve video error');
      throw error;
    }
  },

  
  async createVideo(payload) {
    try {
      const { data } = await api.post(
        '/media/videos/',
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return data;
    } catch (error) {
      console.error('Create video error');
      throw error;
    }
  },

 
  async updateVideo(slug, payload) {
    try {
      const { data } = await api.put(
        `/media/videos/${slug}/`,
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return data;
    } catch (error) {
      console.error('Update video error');
      throw error;
    }
  },

  
  async patchVideo(slug, payload) {
    try {
      const { data } = await api.patch(
        `/media/videos/${slug}/`,
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return data;
    } catch (error) {
      console.error('Patch video error');
      throw error;
    }
  },

  
  async deleteVideo(slug) {
    try {
      const { data } = await api.delete(
        `/media/videos/${slug}/`
      );

      return data;
    } catch (error) {
      console.error('Delete video error');
      throw error;
    }
  },
 
  async get(id) {
    try {
      const response = await api.get(`/uploads/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Get upload API error');
      throw error;
    }
  },

 
  async upload(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/uploads/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('File upload API error');
      throw error;
    }
  },

  async create(payload) {
    try {
      const { data } = await api.post(
        '/media/documents/',
        payload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return data;
    } catch (error) {
      console.error('Create documents error');
      throw error;
    }
  },

  async updateDocuments(slug, payload) {
    try {
      const { data } = await api.patch(
        `/media/documents/${slug}/`,
        payload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return data;
    } catch (error) {
      console.error('Update documents error');
      throw error;
    }
  },


  async getDocuments(params = {}) {
    try {
      const { data } = await api.get('/media/documents/', { params });
      return data;
    } catch (error) {
      console.error('List documents error');
      throw error;
    }
  },

  async deleteDocuments(slug) {
    try {
      const { data } = await api.delete(`/media/documents/${slug}/`);
      return data;
    } catch (error) {
      console.error('Delete documents error');
      throw error;
    }
  },


  async getSingleDocuments(slug) {
    try {
      const { data } = await api.get(`/media/documents/${slug}/`);
      return data;
    } catch (error) {
      console.error('Retrieve document error');
      throw error;
    }
  },


  
  async update(id, payload) {
    try {
      const response = await api.patch(`/uploads/${id}/`, payload);
      return response.data;
    } catch (error) {
      console.error('Update upload API error');
      throw error;
    }
  },

  
  async delete(id) {
    try {
      const response = await api.delete(`/uploads/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Delete upload API error');
      throw error;
    }
  },

  async gallery(params = {}) {
    try {
      const response = await api.get('/media/gallery/', { params });
      return response.data;
    } catch (error) {
      console.error('List gallery API error');
      throw error;
    }
  },

  async postGalleryItems(id, payload) {
    try {
      const response = await api.post(`/media/gallery/${id}/add-item/`, payload);
      return response.data;
    } catch (error) {
      console.error('Update upload API error');
      throw error;
    }
  },
  async singleGallery(params = {}) {
    try {
      const response = await api.get(`/media/gallery/${id}`, { params });
      return response.data;
    } catch (error) {
      console.error('List gallery API error');
      throw error;
    }
  },
  async postGallery(payload) {
    try {
      const response = await api.post(`/media/gallery/`, payload);
      return response.data;
    } catch (error) {
      console.error('Update upload API error');
      throw error;
    }
  },
  async getMinutes(params = {}) {
    try {
      const { data } = await api.get('/media/meeting-minutes/', { params });
      return data;
    } catch (error) {
      console.error('List meeting minutes error');
      throw error;
    }
  },

  async getSingleMinutes(slug) {
    try {
      const { data } = await api.get(`/media/meeting-minutes/${slug}/`);
      return data;
    } catch (error) {
      console.error('Retrieve meeting minutes error');
      throw error;
    }
  },

  async createMinutes(payload) {
    try {
      const { data } = await api.post(
        '/media/meeting-minutes/',
        payload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return data;
    } catch (error) {
      console.error('Create meeting minutes error');
      throw error;
    }
  },

  async updateMinutes(slug, payload) {
    try {
      const { data } = await api.patch(
        `/media/meeting-minutes/${slug}/`,
        payload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return data;
    } catch (error) {
      console.error('Update meeting minutes error');
      throw error;
    }
  },

  async deleteMinutes(slug) {
    try {
      const { data } = await api.delete(`/media/meeting-minutes/${slug}/`);
      return data;
    } catch (error) {
      console.error('Delete meeting minutes error');
      throw error;
    }
  },

  async retrieveGallery(id) {
    try {
      const { data } = await api.get(`/media/gallery/${id}/`);
      return data;
    } catch (error) {
      console.error('Retrieve gallery image error');
      throw error;
    }
  },

  async createGallery(payload) {
    try {
      const { data } = await api.post(
        '/media/gallery/',
        payload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return data;
    } catch (error) {
      console.error('Upload gallery image error');
      throw error;
    }
  },

  async updateGallery(id, payload) {
    try {
      const { data } = await api.patch(
        `/media/gallery/${id}/`,
        payload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return data;
    } catch (error) {
      console.error('Update gallery image error');
      throw error;
    }
  },

  async deleteGallery(id) {
    try {
      const { data } = await api.delete(`/media/gallery/${id}/`);
      return data;
    } catch (error) {
      console.error('Delete gallery image error');
      throw error;
    }
  },

  async listNewsletters(params = {}) {
    try {
      const { data } = await api.get('/media/newsletters/', { params });
      return data;
    } catch (error) {
      console.error('List newsletters error');
      throw error;
    }
  },

  async retrieveNewsletters(slug) {
    try {
      const { data } = await api.get(`/media/newsletters/${slug}/`);
      return data;
    } catch (error) {
      console.error('Retrieve newsletter error');
      throw error;
    }
  },

  async createNewsletters(payload) {
    try {
      const { data } = await api.post(
        '/media/newsletters/',
        payload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return data;
    } catch (error) {
      console.error('Create newsletter error');
      throw error;
    }
  },

  async updateNewsletters(slug, payload) {
    try {
      const { data } = await api.patch(
        `/media/newsletters/${slug}/`,
        payload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return data;
    } catch (error) {
      console.error('Update newsletter error');
      throw error;
    }
  },

  async deleteNewsletters(slug) {
    try {
      const { data } = await api.delete(`/media/newsletters/${slug}/`);
      return data;
    } catch (error) {
      console.error('Delete newsletter error');
      throw error;
    }
  },
  async listPublications(params = {}) {
    try {
      const { data } = await api.get('/media/publications/', { params });
      return data;
    } catch (error) {
      console.error('List publications error');
      throw error;
    }
  },

  async createPublications(payload) {
    try {
      const { data } = await api.post(
        '/media/publications/',
        payload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return data;
    } catch (error) {
      console.error('Create publication error');
      throw error;
    }
  },

  async updatepublications(slug, payload) {
    try {
      const { data } = await api.patch(
        `/media/publications/${slug}/`,
        payload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return data;
    } catch (error) {
      console.error('Update publication error');
      throw error;
    }
  },

  async deletepublications(slug) {
    try {
      const { data } = await api.delete(`/media/publications/${slug}/`);
      return data;
    } catch (error) {
      console.error('Delete publication error');
      throw error;
    }
  },

  async listEditorials(params = {}) {
    try {
      const { data } = await api.get('/media/editorials/', { params });
      return data;
    } catch (error) {
      console.error('List editorials error');
      throw error;
    }
  },

  async createEditorials(payload) {
    try {
      const { data } = await api.post(
        '/media/editorials/',
        payload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return data;
    } catch (error) {
      console.error('Create editorial error');
      throw error;
    }
  },

  async deleteEditorials(slug) {
    try {
      const { data } = await api.delete(`/media/editorials/${slug}/`);
      return data;
    } catch (error) {
      console.error('Delete editorial error');
      throw error;
    }
  },
};
