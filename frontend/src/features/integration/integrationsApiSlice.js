import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const integrationsAdapter = createEntityAdapter({})

const initialState = integrationsAdapter.getInitialState()

export const integrationsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        fetchSalesforceContacts: builder.mutation({
            query: () => ({
                url: '/integrations/salesforce/contacts',
                method: 'GET'
            }),
            transformResponse: (responseData, meta, arg) => {
                const contacts = responseData.map(contact => ({
                    id: contact.Id,
                    ...contact
                }));
                return integrationsAdapter.setAll(initialState, contacts);
            },
            invalidatesTags: [{ type: 'Integration', id: 'LIST' }]
        }),
    }),
})

// Export hooks for usage in components
export const {
    useFetchSalesforceContactsMutation,
} = integrationsApiSlice

// Selectors to access integration state
const selectIntegrationsResult = integrationsApiSlice.endpoints.fetchSalesforceContacts.select()
const selectIntegrationsData = createSelector(
    selectIntegrationsResult,
    integrationsResult => integrationsResult.data
)

export const {
    selectAll: selectAllIntegrations,
    selectById: selectIntegrationById,
    selectIds: selectIntegrationIds
} = integrationsAdapter.getSelectors(state => selectIntegrationsData(state) ?? initialState)
