'use client';

import { useFormStore } from '../store/formStore';
import Modal from '../components/Modal/Modal';

const UncontrolledForm = () => <div>Uncontrolled Form Content</div>;
const RHFForm = () => <div>React Hook Form Content</div>;

export default function HomePage() {
  const { isModalOpen, modalContent, openModal, closeModal } = useFormStore();

  const getModalTitle = () => {
    if (modalContent === 'uncontrolled') return 'Uncontrolled Form';
    if (modalContent === 'rhf') return 'React Hook Form';
    return '';
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', gap: '1rem' }}>
      <button onClick={() => openModal('uncontrolled')}>
        Open Uncontrolled Form
      </button>
      <button onClick={() => openModal('rhf')}>Open React Hook Form</button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={getModalTitle()}>
        {modalContent === 'uncontrolled' && <UncontrolledForm />}
        {modalContent === 'rhf' && <RHFForm />}
      </Modal>
    </div>
  );
}
