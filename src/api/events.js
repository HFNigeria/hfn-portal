import api from './axios.js';

export default {
  async listEvents(params = {}) {
    try {
      const response = await api.get('/events/', { params });
      return response.data;
    } catch (error) {
      console.error('List events API error');
      throw error;
    }
  },

  async getEvent(slug) {
    try {
      const response = await api.get(`/events/${slug}/`);
      return response.data;
    } catch (error) {
      console.error('Get event API error');
      throw error;
    }
  },

  async createEvent(slug, payload) {
    try {
      const response = await api.post(`/events/${slug}/register/`, payload);
      return response.data;
    } catch (error) {
      console.error('Create event API error');
      throw error;
    }
  },

  async createCalenderEvent(payload) {
    try {
      const response = await api.post(`/events/`, payload);
      return response.data;
    } catch (error) {
      console.error('Create event API error');
      throw error;
    }
  },


  
  
  
  
  
  
  
  
  

  async updateEvent(slug, payload) {
    try {
      const response = await api.put(`/events/${slug}/`, payload);
      return response.data;
    } catch (error) {
      console.error('Update event API error');
      throw error;
    }
  },


  async deleteEvent(slug) {
    try {
      const response = await api.delete(`/events/${slug}/`);
      return response.data;
    } catch (error) {
      console.error('Delete event API error');
      throw error;
    }
  },

  async listEventGalleries(params = {}) {
    try {
      const response = await api.get('/events/event-galleries/', { params });
      return response.data;
    } catch (error) {
      console.error('List event galleries API error');
      throw error;
    }
  },

  async getEventGallery(id) {
    try {
      const response = await api.get(`/events/event-galleries/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Get event gallery API error');
      throw error;
    }
  },

  async createEventGallery(payload) {
    try {
      const response = await api.post('/events/event-galleries/', payload);
      return response.data;
    } catch (error) {
      console.error('Create event gallery API error');
      throw error;
    }
  },

  async deleteEventGallery(id) {
    try {
      const response = await api.delete(`/events/event-galleries/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Delete event gallery API error');
      throw error;
    }
  },

  async listEventRegistrations(params = {}) {
    try {
      const response = await api.get('/events/event-registrations/', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('List event registrations API error');
      throw error;
    }
  },

  async getEventRegistration(id) {
    try {
      const response = await api.get(`/events/event-registrations/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Get event registration API error');
      throw error;
    }
  },

  async createEventRegistration(payload) {
    try {
      const response = await api.post('/events/event-registrations/', payload);
      return response.data;
    } catch (error) {
      console.error('Create event registration API error');
      throw error;
    }
  },

  async updateEventRegistration(id, payload) {
    try {
      const response = await api.patch(
        `/events/event-registrations/${id}/`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error('Update event registration API error');
      throw error;
    }
  },

  async deleteEventRegistration(id) {
    try {
      const response = await api.delete(`/events/event-registrations/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Delete event registration API error');
      throw error;
    }
  },

  async myEventRegistrations() {
    try {
      const response = await api.get(
        '/events/event-registrations/my_registrations/'
      );
      return response.data;
    } catch (error) {
      console.error('Get my registrations API error');
      throw error;
    }
  },

  async listEventPayments(params = {}) {
    try {
      const response = await api.get('/events/event-payments/', { params });
      return response.data;
    } catch (error) {
      console.error('List event payments API error');
      throw error;
    }
  },

  async getEventPayment(id) {
    try {
      const response = await api.get(`/events/event-payments/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Get event payment API error');
      throw error;
    }
  },

  async initiateEventPayment(payload) {
    try {
      const response = await api.post(
        '/events/event-payments/initiate/',
        payload
      );
      return response.data;
    } catch (error) {
      console.error('Initiate event payment API error');
      throw error;
    }
  },

  async verifyEventPayment(payload) {
    try {
      const response = await api.post(
        '/events/event-payments/verify/',
        payload
      );
      return response.data;
    } catch (error) {
      console.error('Verify event payment API error');
      throw error;
    }
  },
  async createRsvp() {
    try {
      const response = await api.post(`/events/${slug}/rsvp/`, {});
      return response.data;
    } catch (error) {
      console.error('Create event API error');
      throw error;
    }
  },
};
