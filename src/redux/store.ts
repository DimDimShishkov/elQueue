import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import ticketsReducer from "./ticketsSlice";

export const store = configureStore({
  reducer: { tickets: ticketsReducer },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
