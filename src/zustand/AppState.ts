import {create} from 'zustand'
import {UserDto} from "@/page/UserProfile.tsx";
import {UserSignupResponse} from "@/page/SignUp.tsx";
import {persist} from 'zustand/middleware'
import {getParticipant} from "@/axios/Request.ts";
import {CompanySubscription} from "@/info/ApplicationType.ts";
import {Participant} from "@/service/WebSocketService.ts";

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

export type PdfProcessed = {
    name: string,
    phone: string,
    email: string,
    location: string,
    organization: string,
    date: string,
    image?: string,
    gender: string,
    pdfUrl?: string,
}

type PdfProcessedItem = {
    item: PdfProcessed,
    setItem: (item: PdfProcessed) => void
}

export const usePdfProcessed = create<PdfProcessedItem>(
    (set) => ({
        item: null,
        setItem: (item: PdfProcessed) => set({item: item}),
    })
)


type PdfItems = {
    url: string,
    setUrl: (url: string) => void
}
export const usePdfItems = create<PdfItems>(
    (set) => ({
        url: '',
        setUrl: (url: string) => set(() => ({url: url}))
    })
)

type UserDtoState = {
    user: UserDto,
    setUser: (user: UserDto) => void
}

export const UserDtoState = create<UserDtoState>(
    (set) => ({
        user: null,
        setUser: (user: UserDto) => set({user: user}),
    })
)


type UserCreationProps = {
    user: UserSignupResponse,
    setUser: (user: UserSignupResponse) => void
}
export const UserCreationState = create<UserCreationProps>(
    (set) => ({
        user: null,
        setUser: (user: UserSignupResponse) => set({user: user}),
    })
)

type MessageReceiverProps = {
    receiverId: string,
    setReceiverId: (id: string) => void
}

export const useMessageReceiverState = create<MessageReceiverProps>()(
    persist(
        (set) => ({
            receiverId: '',
            setReceiverId: (id: string) => set({receiverId: id}),
        }),
        {
            name: 'receiverId'
        },
    )
)

type IsCompanyBannedState = {
    isCompanyBanned: boolean,
    setIsCompanyBanned: (status: boolean) => void,
}

export const useIsCompanyBannedState = create<IsCompanyBannedState>(
    (set) => ({
        isCompanyBanned: false,
        setIsCompanyBanned: (status: boolean) => {set({isCompanyBanned: status})}
    })
)
export interface MinimalPlan{
    name: string,
    priceId: string,
    planPriority: number,
}
type CompanyPlanProps = {
    plan: MinimalPlan | null,
    setPlan: (plan: MinimalPlan) => void
}

export const useCompanyPlanState = create<CompanyPlanProps>(
    (set) => ({
        plan: null,
        setPlan: (plan: MinimalPlan) => set({plan: plan}),
    })
)
interface UseCompanmySubscritopnProps {
    subscription: CompanySubscription | null,
    setSubscription: (subscription: CompanySubscription) => void
}

export const useCompanySubscription= create<UseCompanmySubscritopnProps>(
    (set)=>({
        subscription: null,
        setSubscription: (subscription: CompanySubscription) => set({subscription: subscription}),
    })
)

interface ParticipantStore {
    participants: Map<string, Participant>
    setParticipant: (id: string, participant: Participant) => void
    getOrFetchParticipant: (id: string) => Promise<Participant | undefined>
    clearParticipantStore: () => void
}

export const useParticipantStore = create<ParticipantStore>((set, get) => ({
    participants: new Map<string, Participant>(),

    setParticipant: (id, participant) =>
        set((state) => {
            const updatedMap = new Map(state.participants)
            updatedMap.set(id, participant)
            return { participants: updatedMap }
        }),

    // Thêm hàm mới này để handle cả việc lấy từ cache và gọi API
    getOrFetchParticipant: async (id) => {
        // Lấy state hiện tại
        const state = get()
        const cached = state.participants.get(id)
        if (cached) {
            return cached
        }
        try {
            const participant = await getParticipant(id)
            if (participant) {
                set((state) => {
                    const updatedMap = new Map(state.participants)
                    updatedMap.set(id, participant)
                    return { participants: updatedMap }
                })
                return participant
            }
        } catch (error) {
            console.error('Failed to fetch participant:', error)
        }
        return undefined
    },

    clearParticipantStore: () =>
        set(() => ({
            participants: new Map<string, Participant>()
        }))
}))
