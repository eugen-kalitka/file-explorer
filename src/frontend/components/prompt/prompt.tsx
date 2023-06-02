import React, { useState } from 'react';
import { create } from 'react-modal-promise';
import { Modal, Form, Button } from 'react-bootstrap';

const Prompt = create(({ isOpen, onResolve, onReject }) => {
  const [folderName, setFolderName] = useState('');

  const handleChange = (e) => {
    setFolderName(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onResolve(folderName);
  }

  return (
    <Modal show={isOpen} onHide={() => {}}>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Label htmlFor="inputFolderName">Folder Name</Form.Label>
          <Form.Control
            type="text"
            id="inputFolderName"
            onChange={handleChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => onReject()}>
            Close
          </Button>
          <Button disabled={!folderName} variant="primary" type="submit">
            Confirm
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
});

export default Prompt;
