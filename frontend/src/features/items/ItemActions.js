import { useState } from 'react';
import { Dropdown, Button, ButtonGroup } from 'react-bootstrap';
import { useCanUserCheckOutAndInItemQuery, useCheckOutItemMutation, useCheckInItemMutation } from './itemsApiSlice';
import ChangeRequestModal from '../changes/ChangeRequestModal';
import EditItemModal from './EditItemModal';
import useAuth from '../../hooks/useAuth';
import { useToggleFeaturedDesignMutation } from '../designs/designsApiSlice';

const ItemActions = ({ itemType, itemData }) => {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const { id: userId, isAdmin, isProjectManager } = useAuth();

    const {
        data: permissionData,
        isLoading: loadingPermissions,
        isError: permissionError,
    } = useCanUserCheckOutAndInItemQuery({ itemId: itemData.id, userId, projectId: itemData.projectId });

    const [checkOutItem, { isLoading: loadingCheckOut }] = useCheckOutItemMutation();
    const [checkInItem, { isLoading: loadingCheckIn }] = useCheckInItemMutation();
    const [toggleFeatured] = useToggleFeaturedDesignMutation();

    const handleToggleFeatured = async (designId) => {
        try {
            await toggleFeatured(designId).unwrap();
            console.log('Design featured status toggled successfully!');
        } catch (error) {
            console.error('Failed to toggle featured status: ', error);
        }
    };

    const handleCheckOut = async () => {
        try {
            if (permissionData?.authorized) {
                await checkOutItem({ itemId: itemData.id, userId, itemType}).unwrap();
                alert("Item checked out successfully.");
            } else {
                alert("You do not have permission to check out this item.");
            }
        } catch (error) {
            alert(error.data?.message || "Failed to check out the item.");
        }
    };

    const handleCheckIn = async () => {
        try {
            if (permissionData?.authorized) {
                const result = await checkInItem({ itemId: itemData.id, userId, itemType}).unwrap();
                if (result.error) {
                    alert(result.error.message || "Failed to check in the item.");
                } else {
                    alert("Item checked in successfully. You can now edit the item.");
                    handleOpenEditModal();
                }
            } else {
                alert("You do not have permission to check in this item.");
            }
        } catch (error) {
            alert(error.data?.message || "Failed to check in the item.");
        }
    };
    
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleOpenEditModal = () => setShowEditModal(true);
    const handleCloseEditModal = () => setShowEditModal(false);

    return (
        <>
            <Dropdown as={ButtonGroup} className="actions-dropdown">
                <Button variant="secondary">Actions</Button>
                <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />
                <Dropdown.Menu>
                    {itemType === 'Design' && (isAdmin || isProjectManager) && (
                        <Dropdown.Item onClick={() => handleToggleFeatured(itemData.id)}>
                            {itemData.isFeatured ? 'Un-Feature Design' : 'Feature Design'}
                        </Dropdown.Item>
                    )}
                    {console.log(permissionData)}
                    <Dropdown.Item onClick={handleCheckOut} disabled={loadingCheckOut || !permissionData?.authorized}>Check Out</Dropdown.Item>
                    <Dropdown.Item onClick={handleCheckIn} disabled={loadingCheckIn || !permissionData?.authorized}>Check In</Dropdown.Item>
                    <Dropdown.Item onClick={handleOpenModal}>Make a Change Request</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <ChangeRequestModal
                show={showModal}
                handleClose={handleCloseModal}
                projectId={itemData.projectId}
                mainItemId={itemData.id}
                itemType={itemType}
            />
            <EditItemModal
                show={showEditModal}
                handleClose={handleCloseEditModal}
                itemType={itemType}
                projectId={itemData.projectId}
                itemData={itemData}
            />
        </>
    );
};

export default ItemActions;