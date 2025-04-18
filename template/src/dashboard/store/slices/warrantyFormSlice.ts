// // slices/warrantyFormSlice.ts
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { WarrantyTemplateUpdatePayload } from '../../../interfaces';
// import { DefaultWarrantyTemplate } from '../../mocks';

// interface WarrantyFormState {
//     formData: WarrantyTemplateUpdatePayload;
//     isDirty: boolean;
// }

// const initialState: WarrantyFormState = {
//     formData: DefaultWarrantyTemplate,
//     isDirty: false,
// };

// const warrantyFormSlice = createSlice({
//     name: 'warrantyForm',
//     initialState,
//     reducers: {
//         initializeForm: (state, action: PayloadAction<WarrantyTemplateUpdatePayload | null>) => {
//             state.formData = action.payload
//                 ? { ...action.payload }
//                 : { ...DefaultWarrantyTemplate, name: action.payload?.name || '' };
//             state.isDirty = false;
//         },
//         updateField: (state, action: PayloadAction<{ path: string; value: any }>) => {
//             const { path, value } = action.payload;
//             const keys = path.split('.');
//             let current: any = state.formData;

//             for (let i = 0; i < keys.length - 1; i++) {
//                 current = current[keys[i]];
//             }
//             current[keys[keys.length - 1]] = value;
//             state.isDirty = true;
//         },
//         updateWarrantyField: (
//             state,
//             action: PayloadAction<{ index: number; field: string; value: any }>
//         ) => {
//             const { index, field, value } = action.payload;
//             if (state.formData.warranties && state.formData.warranties[index]) {
//                 (state.formData.warranties[index] as any)[field] = value;
//                 state.isDirty = true;
//             }
//         },
//         setDefaultSelected: (state, action: PayloadAction<number>) => {
//             state.formData.warranties = state.formData.warranties?.map((warranty, idx) => ({
//                 ...warranty,
//                 defaultSelected: idx === action.payload,
//             })) || [];
//             state.isDirty = true;
//         },
//         resetForm: (state) => {
//             state.formData = { ...DefaultWarrantyTemplate };
//             state.isDirty = false;
//         },
//     },
// });

// export const {
//     initializeForm,
//     updateField,
//     updateWarrantyField,
//     setDefaultSelected,
//     resetForm
// } = warrantyFormSlice.actions;

// export default warrantyFormSlice.reducer;