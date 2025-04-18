// // slices/warrantyTemplatesSlice.ts
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { WarrantyTemplateUpdatePayload } from '../../../interfaces';
// import { remove } from 'lodash';

// // Define the state interface
// interface WarrantyTemplatesState {
//     loading: boolean;
//     data: WarrantyTemplateUpdatePayload[];
//     error: string | null;
// }

// // Initial state
// const initialState: WarrantyTemplatesState = {
//     loading: false,
//     data: [],
//     error: null,
// };

// // Create the slice
// const warrantyTemplatesSlice = createSlice({
//     name: 'warrantyTemplates',
//     initialState,
//     reducers: {
//         fetchWarrantyTemplatesStart(state) {
//             state.loading = true;
//             state.error = null;
//         },
//         fetchWarrantyTemplatesSuccess(state, action: PayloadAction<WarrantyTemplateUpdatePayload[]>) {
//             state.loading = false;
//             state.data = action.payload;
//             state.error = null;
//         },
//         fetchWarrantyTemplatesFailure(state, action: PayloadAction<string>) {
//             state.loading = false;
//             state.error = action.payload;
//             state.data = [];
//         },
//         removeWarrantyTemplate(state, action: PayloadAction<string>) {
//             remove(state.data, (template) => template.templateId === action.payload);
//         }
//     },
// });

// // Export actions
// export const {
//     fetchWarrantyTemplatesStart,
//     fetchWarrantyTemplatesSuccess,
//     fetchWarrantyTemplatesFailure,
//     removeWarrantyTemplate
// } = warrantyTemplatesSlice.actions;

// // Export reducer
// export default warrantyTemplatesSlice.reducer;