import create from "zustand";

type State = {
    bears: number;
    increase: (by: number) => void;
};

const useStore = create<State>((set) => ({
    bears: 0,
    increase: () => set((state) => ({ bears: state.bears + 1 })),
}));

export default useStore;
