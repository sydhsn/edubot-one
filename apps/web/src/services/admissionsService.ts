import { api } from './api';

export interface DirectAdmissionRequest {
  student_name: string;
  email: string;
  password: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  class_name: string;
  previous_school?: string;
  address: string;
  date_of_birth: string;
  admission_number?: string;
}

export interface AdmissionResponse {
  message: string;
  admission_id: string;
  student_id: string;
  admission_number: string;
  email: string;
  class: string;
  status: string;
}

export interface AdmissionRecord {
  admission_id: string;
  student_id: string;
  student_name: string;
  email: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  class_name: string;
  previous_school?: string;
  address: string;
  date_of_birth: string;
  admission_number: string;
  registered_by: string;
  registered_at: string;
  status: string;
}

class AdmissionsService {
  /**
   * Register a student directly (admin only)
   */
  async registerStudent(data: DirectAdmissionRequest): Promise<AdmissionResponse> {
    try {
      const response = await api.post<AdmissionResponse>('/admissions/register-student', data);
      return response.data;
    } catch (error: unknown) {
      console.error('Student registration failed:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { detail?: string } } };
        if (axiosError.response?.status === 400) {
          throw new Error(axiosError.response.data?.detail || 'Invalid student data provided');
        } else if (axiosError.response?.status === 409) {
          throw new Error('Student with this email already exists');
        } else if (axiosError.response?.status === 403) {
          throw new Error('Only administrators can register students');
        } else if (axiosError.response?.status === 422) {
          throw new Error('Please check all required fields are filled correctly');
        } else {
          throw new Error(axiosError.response?.data?.detail || 'Failed to register student');
        }
      } else {
        throw new Error('Failed to register student');
      }
    }
  }

  /**
   * Get all admission records (admin/teacher only)
   */
  async getAdmissionRecords(): Promise<AdmissionRecord[]> {
    try {
      const response = await api.get<AdmissionRecord[]>('/admissions/');
      return response.data;
    } catch (error: unknown) {
      console.error('Failed to fetch admission records:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { detail?: string } } };
        if (axiosError.response?.status === 403) {
          throw new Error('Access denied. Only administrators and teachers can view admission records');
        } else {
          throw new Error(axiosError.response?.data?.detail || 'Failed to fetch admission records');
        }
      } else {
        throw new Error('Failed to fetch admission records');
      }
    }
  }

  /**
   * Get specific admission record
   */
  async getAdmissionRecord(admissionId: string): Promise<AdmissionRecord> {
    try {
      const response = await api.get<AdmissionRecord>(`/admissions/${admissionId}`);
      return response.data;
    } catch (error: unknown) {
      console.error('Failed to fetch admission record:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { detail?: string } } };
        if (axiosError.response?.status === 404) {
          throw new Error('Admission record not found');
        } else if (axiosError.response?.status === 403) {
          throw new Error('Access denied. Only administrators and teachers can view admission records');
        } else {
          throw new Error(axiosError.response?.data?.detail || 'Failed to fetch admission record');
        }
      } else {
        throw new Error('Failed to fetch admission record');
      }
    }
  }

  /**
   * Delete admission record (admin only)
   */
  async deleteAdmissionRecord(admissionId: string): Promise<void> {
    try {
      await api.delete(`/admissions/${admissionId}`);
    } catch (error: unknown) {
      console.error('Failed to delete admission record:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { detail?: string } } };
        if (axiosError.response?.status === 404) {
          throw new Error('Admission record not found');
        } else if (axiosError.response?.status === 403) {
          throw new Error('Only administrators can delete admission records');
        } else {
          throw new Error(axiosError.response?.data?.detail || 'Failed to delete admission record');
        }
      } else {
        throw new Error('Failed to delete admission record');
      }
    }
  }
}

export default new AdmissionsService();