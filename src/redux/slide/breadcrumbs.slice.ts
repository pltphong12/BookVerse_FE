import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsState {
  items: BreadcrumbItem[];
}

const initialState: BreadcrumbsState = {
  items: [],
};

export const breadcrumbsSlice = createSlice({
  name: 'breadcrumbs',
  initialState,
  reducers: {
    setBreadcrumbs: (state, action: PayloadAction<BreadcrumbItem[]>) => {
      state.items = action.payload;
    },
    addBreadcrumb: (state, action: PayloadAction<BreadcrumbItem>) => {
      state.items.push(action.payload);
    },
    clearBreadcrumbs: (state) => {
      state.items = [];
    },
  },
});

export const { setBreadcrumbs, addBreadcrumb, clearBreadcrumbs } = breadcrumbsSlice.actions;

export default breadcrumbsSlice.reducer;