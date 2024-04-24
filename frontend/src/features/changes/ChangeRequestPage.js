import ChangeRequestTabs from './ChangeRequestsTabs';
import { useLocation } from 'react-router-dom';

const ChangeRequestPage = () => {
  const location = useLocation();
  const itemData = location.state?.itemData;

  return (
    <>
      <ChangeRequestTabs 
        changeRequestData={itemData} 
      />
    </>
  );
};

export default ChangeRequestPage;
