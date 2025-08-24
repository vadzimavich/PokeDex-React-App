'use client';

import { useFormStore, type StoredFormData } from '../store/formStore';
import Modal from '../components/Modal/Modal';
import UncontrolledForm from '../components/UncontrolledForm/UncontrolledForm';
import RHFForm from '../components/RHFForm/RHFForm';
import DataCard from '../components/DataCard/DataCard';

export default function HomePage() {
  const {
    isModalOpen,
    modalContent,
    formData,
    newlyAddedId,
    openModal,
    closeModal,
    addFormData,
    clearNewlyAddedId,
  } = useFormStore();

  const getModalTitle = () => {
    if (modalContent === 'uncontrolled') return 'Uncontrolled Form';
    if (modalContent === 'rhf') return 'React Hook Form';
    return '';
  };

  const handleFormSubmit = (data: Omit<StoredFormData, 'id'>) => {
    addFormData(data);
    closeModal();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => openModal('uncontrolled')}>
          Open Uncontrolled Form
        </button>
        <button onClick={() => openModal('rhf')}>Open React Hook Form</button>
      </div>

      <h2>Submitted Data:</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {formData.length > 0 ? (
          formData.map((data) => (
            <DataCard
              key={data.id}
              data={data}
              isNew={data.id === newlyAddedId}
              onClearNew={clearNewlyAddedId}
            />
          ))
        ) : (
          <p>No data submitted yet.</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={getModalTitle()}>
        {modalContent === 'uncontrolled' && (
          <UncontrolledForm onSubmit={handleFormSubmit} />
        )}
        {modalContent === 'rhf' && <RHFForm onSubmit={handleFormSubmit} />}
      </Modal>
    </div>
  );
}
