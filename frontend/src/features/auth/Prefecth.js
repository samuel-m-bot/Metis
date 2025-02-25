import { store } from '../../app/store'
import { usersApiSlice } from '../users/usersApiSlice';
import { projectsApiSlice } from '../projects/projectsApiSlice';
import { productsApiSlice } from '../products/productsApiSlice';
import { tasksApiSlice } from '../Tasks/tasksApiSlice';
import { designsApiSlice } from '../designs/designsApiSlice';
import { documentsApiSlice } from '../documents/documentsApiSlice';
import { reviewsApiSlice } from '../reviews/reviewsApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
    useEffect(() => {
        console.log('subscribing')
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())
        const projects = store.dispatch(projectsApiSlice.endpoints.getProjects.initiate())
        const products = store.dispatch(productsApiSlice.endpoints.getProjects.initiate())
        const tasks = store.dispatch(tasksApiSlice.endpoints.getProjects.initiate())
        const designs = store.dispatch(designsApiSlice.endpoints.getProjects.initiate())
        const documents = store.dispatch(documentsApiSlice.endpoints.getProjects.initiate())
        const reviews = store.dispatch(reviewsApiSlice.endpoints.getProjects.initiate())


        return () => {
            console.log('unsubscribing')
            users.unsubscribe()
            projects.unsubscribe()
            products.unsubscribe()
            tasks.unsubscribe()
            designs.unsubscribe()
            documents.unsubscribe()
            reviews.unsubscribe()
        }
    }, [])

    return <Outlet />
}
export default Prefetch