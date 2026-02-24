type Props = { index: number };

export default function IndexBadge({ index }: Props) {
  return (
    <span className='inline-flex items-center justify-center w-7 h-7 border border-gray-400 text-gray-500 text-sm font-bold rounded shrink-0'>
      {index}
    </span>
  );
}
