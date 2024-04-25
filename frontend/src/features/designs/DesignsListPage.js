import React from 'react';
import DesignList from './DesignList';
import { useGetDesignsQuery } from './designsApiSlice';

const DesignsListPage = ({ projectId }) => {
    const {
        data: designData,
        isLoading,
        isError,
        error
    } = useGetDesignsQuery('designList', {
        pollingInterval: 120000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const design = designData ? designData?.ids.map(id => designData.entities[id]) : [];

    return (
        <div>
            <div className='row'>
                <h3>All design</h3>
                    <DesignList 
                        designs={design}
                    />
            </div>
        </div>
    );
};

export default DesignsListPage;