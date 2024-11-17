import {create} from 'zustand'
import {UserDto} from "@/page/UserProfile.tsx";

interface BearState {
    bears: number
    increase: (by: number) => void
}

const useBearStore = create<BearState>()(
    (set) => ({
        bears: 0,
        increase: (by) => set((state) => ({bears: state.bears + by})),
    })
)

export type PdfProcessed={
    Name: string,
    Phone: string,
    Email: string,
    Location: string,
    Organization: string,
    Date: string,
    Avatar?: string,
    pdfUrl?: string,
}

type PdfProcessedItem ={
    item: PdfProcessed,
    setItem : (item: PdfProcessed) => void
}

export const usePdfProcessed =create<PdfProcessedItem>(
    (set) => ({
        item : null,
        setItem : (item: PdfProcessed) => set({item: item}),
    })
)


type PdfItems ={
    url: string,
    setUrl: (url: string) => void
}
export const usePdfItems =create<PdfItems>(
    (set) => ({
        url : '',
        setUrl : (url: string) => set(() => ({url:url}))
    })
)

type UserDtoState={
    user: UserDto,
    setUser: (user: UserDto) => void
}

export const UserDtoState=create<UserDtoState>(
    (set) => ({
        user : null,
        setUser : (user: UserDto) => set({user:user}),
    })
)
