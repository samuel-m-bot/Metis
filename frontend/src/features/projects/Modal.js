import './Modal.css'; 

const Modal = ({ onClose, children }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                {children}
                <div className="modal-buttons">
                    <button className="modal-button" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
