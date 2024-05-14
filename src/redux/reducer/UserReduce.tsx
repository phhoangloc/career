
import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit"


const UserReducer = createSlice({
    name: "User",
    initialState: {},
    reducers: {
        setUser: {
            reducer: (state, action: PayloadAction<any>) => {
                return (state = action.payload)
            },
            prepare: (msg: any) => {
                return {
                    payload: msg
                }
            }
        }
    }
})

export const { actions, reducer } = UserReducer
export const { setUser } = actions;

export default UserReducer