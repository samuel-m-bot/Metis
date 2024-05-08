import { useEffect, useState } from 'react';
import { useGetTasksByProjectIdQuery } from '../Tasks/tasksApiSlice';

const useFetchAllTasks = (projectId) => {
    const [allTasks, setAllTasks] = useState({ ids: [], entities: {} });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const {
        data,
        isFetching,
        isLoading,
        isError,
        isSuccess
    } = useGetTasksByProjectIdQuery({ projectId, page }, { skip: !projectId });

    useEffect(() => {
        console.log("useEffect triggered", { data, isLoading, page });
    }, [isSuccess]);
    
    

    console.log(data);
    return {
        tasks: data?.tasks,
        isLoading: isLoading || isFetching,
        isError,
    };
};

export default useFetchAllTasks;
