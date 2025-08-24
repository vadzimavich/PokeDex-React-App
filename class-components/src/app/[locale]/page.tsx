'use client';

import { useFormStore, type StoredFormData } from '../store/formStore';
import Modal from '../components/Modal/Modal';
import UncontrolledForm from '../components/UncontrolledForm/UncontrolledForm';

const RHFForm = () => <div>React Hook Form Content</div>;

const DataCard = ({ data }: { data: StoredFormData }) => (
  <div
    style={{
      border: '1px solid #555',
      borderRadius: '8px',
      padding: '1rem',
      width: '300px',
    }}
  >
    <h4>{data.name}</h4>
    <p>Age: {data.age}</p>
    <p>Email: {data.email}</p>
    <p>Country: {data.country}</p>
    <p>Gender: {data.gender}</p>
    {data.picture && (
      <img
        src={data.picture}
        alt={data.name}
        style={{ maxWidth: '100%', borderRadius: '4px' }}
      />
    )}
  </div>
);

export default function HomePage() {
  const {
    isModalOpen,
    modalContent,
    formData,
    openModal,
    closeModal,
    addFormData,
  } = useFormStore();

  const getModalTitle = () => {
    if (modalContent === 'uncontrolled') return 'Uncontrolled Form';
    if (modalContent === 'rhf') return 'React Hook Form';
    return '';
  };

  const handleFormSubmit = (data: StoredFormData) => {
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
          formData.map((data, index) => <DataCard key={index} data={data} />)
        ) : (
          <p>No data submitted yet.</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={getModalTitle()}>
        {modalContent === 'uncontrolled' && (
          <UncontrolledForm onSubmit={handleFormSubmit} />
        )}
        {modalContent === 'rhf' && <RHFForm />}
      </Modal>
    </div>
  );
}
