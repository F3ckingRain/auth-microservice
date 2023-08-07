import useAppSelector from "@/hooks/useAppSelector";

const returnCount = () => {
  const { count } = useAppSelector((state) => state.countReducer);

  return count;
};

export default returnCount;
