// src/api/servicesAPI.js
import axios from './axiosInstance';

/**
 * Service API module for handling all service-related requests
 */

// Base endpoint
const SERVICES_ENDPOINT = '/services';

// Helper function for error handling
const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Service request failed' };
  }
};

// Service Requests API
export const serviceAPI = {
  // Create a new service request
  createServiceRequest: async (requestData) => {
    return handleRequest(
      axios.post(`${SERVICES_ENDPOINT}/requests/`, requestData)
    );
  },

  // Get all service requests (admin only)
  getAllServiceRequests: async () => {
    return handleRequest(
      axios.get(`${SERVICES_ENDPOINT}/requests/`)
    );
  },

  // Get service requests by type
  getRequestsByType: async (type) => {
    return handleRequest(
      axios.get(`${SERVICES_ENDPOINT}/requests/?type=${type}`)
    );
  },

  // Specific service types
  getRepairRequests: async () => {
    return handleRequest(
      axios.get(`${SERVICES_ENDPOINT}/repairs/`)
    );
  },

  getConsultations: async () => {
    return handleRequest(
      axios.get(`${SERVICES_ENDPOINT}/consultations/`)
    );
  },

  getOnsiteServices: async () => {
    return handleRequest(
      axios.get(`${SERVICES_ENDPOINT}/onsite/`)
    );
  },

  // Update request status
  updateRequestStatus: async (requestId, status) => {
    return handleRequest(
      axios.patch(`${SERVICES_ENDPOINT}/requests/${requestId}/`, { status })
    );
  }
};



export default serviceAPI;