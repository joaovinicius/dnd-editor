import kebabCase from 'lodash/kebabCase';
import { formatCurrency } from '../../../lib/number';

type TResults = { amount: number; claim_type: string };

export function AttorneyResults({ results, className }: { className?: string, results: TResults[] }) {
  return (
    <div className={`w-full text-white ${className || ''}`}>
      <p className="text-h2 mb-4 font-medium text-white">Results</p>
      {results.map((result) => (
        <p className="@container" key={kebabCase(result.claim_type)}>
          <strong className="text-fit block text-white">
            {formatCurrency(result.amount)}
          </strong>
          <span>{result.claim_type}</span>
        </p>
      ))}
    </div>
  );
}
