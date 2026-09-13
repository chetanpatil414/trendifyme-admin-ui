import { AttributeApi } from '../types/attribute';

const API_BASE_URL = 'http://localhost:8080/api';

export const fetchAttributes = async (): Promise<AttributeApi[]> => {
  const response = await fetch(`${API_BASE_URL}/attributes`);
  if (!response.ok) {
    throw new Error('Failed to fetch attributes');
  }
  return response.json();
};

export const createAttribute = async (data: { name: string; displayName: string; type: string }): Promise<AttributeApi> => {
  const response = await fetch(`${API_BASE_URL}/admin/attributes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create attribute');
  }
  return response.json();
};

export const updateAttribute = async (id: number, data: { name: string; displayName: string; type: string }): Promise<AttributeApi> => {
  const response = await fetch(`${API_BASE_URL}/admin/attributes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update attribute');
  }
  return response.json();
};

export const deactivateAttribute = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/admin/attributes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to deactivate attribute');
  }
};

export const addAttributeOption = async (attributeId: number, data: { value: string; displayValue: string; sortOrder?: number }) => {
  const response = await fetch(`${API_BASE_URL}/admin/attributes/${attributeId}/options`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to add attribute option');
  }
  return response.json();
};

export const updateAttributeOption = async (attributeId: number, optionId: number, data: { value: string; displayValue: string; sortOrder?: number }) => {
  const response = await fetch(`${API_BASE_URL}/admin/attributes/${attributeId}/options/${optionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update attribute option');
  }
  return response.json();
};

export const deactivateAttributeOption = async (attributeId: number, optionId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/admin/attributes/${attributeId}/options/${optionId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to deactivate attribute option');
  }
};
