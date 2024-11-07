import {create} from 'zustand'
import {persist} from 'zustand/middleware'
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
