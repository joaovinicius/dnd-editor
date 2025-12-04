import { Attorney } from '../../../lib/model';
import { AttorneyResults } from './attorney-results';

export type AttorneyCardProps = {
  attorney: Attorney;
};

export function AttorneyCard({ attorney }: AttorneyCardProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-around md:flex-col md:items-start">
      <div className="group relative w-full overflow-hidden rounded-2xl sm:max-w-1/2 md:max-w-full">
        <img
          src={attorney.content.data.picture}
          alt={attorney.name}
          width={395}
          height={480}
          className="h-auto w-full"
        />
        {attorney.content.data.settlements.length > 0 && (
          <div className="bg-opacity-50 absolute top-0 left-0 hidden h-full w-full items-end justify-start bg-black/45 p-4 group-hover:md:flex">
            <AttorneyResults results={attorney.content.data.settlements} />
          </div>
        )}
      </div>

      <div>
        <div className="mb-6 text-white">
          <p className="text-h2 text-white">{attorney.name}</p>
          <p>{attorney.content.data.degree}</p>
        </div>
        {attorney.content.data.settlements.length > 0 && (
          <AttorneyResults
            className="md:hidden"
            results={attorney.content.data.settlements}
          />
        )}
      </div>
    </div>
  );
}
