// Simple calculation service for demo
export async function calculateInvestment(property, strategy, params) {
  const calculations = calculateAllStrategies(property, params);
  
  // Return the specific strategy requested
  switch(strategy.toLowerCase()) {
    case 'airbnb':
      return { ...calculations.airbnb, strategy: 'airbnb', property };
    case 'lease':
      return { ...calculations.lease, strategy: 'lease', property };
    case 'flip':
      return { ...calculations.flip, strategy: 'flip', property };
    default:
      throw new Error('Invalid strategy');
  }
}

export function calculateAllStrategies(property, { downPayment, interestRate, loanTerm }) {
  const price = property.price;
  const principal = price - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const n = loanTerm * 12;

  const mortgage =
    monthlyRate === 0 ? principal / n :
    principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);

  const monthlyTaxIns = (price * 0.012) / 12;
  const maintenanceVacancy = (price * 0.01) / 12;
  const fixedMonthly = monthlyTaxIns + maintenanceVacancy;

  const baseRent = property.estimatedRent ?? Math.round(price * 0.007);
  const airbnbGross = Math.round(baseRent * 1.45);
  const leaseGross  = Math.round(baseRent * 1.00);

  // Airbnb
  const airbnbMonthlyIncome   = airbnbGross;
  const airbnbMonthlyCashFlow = airbnbMonthlyIncome - (mortgage + fixedMonthly + 150);
  const airbnbAnnualCashFlow  = airbnbMonthlyCashFlow * 12;
  const airbnbTotalCashNeeded = downPayment + (price * 0.03);
  const airbnbTotalROI        = (airbnbAnnualCashFlow / airbnbTotalCashNeeded) * 100;

  // Lease
  const leaseMonthlyIncome   = leaseGross;
  const leaseMonthlyCashFlow = leaseMonthlyIncome - (mortgage + fixedMonthly + 50);
  const leaseAnnualCashFlow  = leaseMonthlyCashFlow * 12;
  const leaseTotalCashNeeded = downPayment + (price * 0.03);
  const leaseTotalROI        = (leaseAnnualCashFlow / leaseTotalCashNeeded) * 100;

  // Flip
  const renovationBudget = 50000;
  const holdingPeriodMonths = 6;
  const afterRepairValue = Math.round(price * 1.10);
  const closingCostsBuy  = price * 0.03;
  const closingCostsSell = afterRepairValue * 0.06;
  const holdingCosts     = (mortgage + fixedMonthly) * holdingPeriodMonths;
  const totalInvestment  = downPayment + renovationBudget + closingCostsBuy + holdingCosts;
  const netProfit        = afterRepairValue - price - renovationBudget - closingCostsSell - closingCostsBuy - holdingCosts;
  const annualizedROI    = ((netProfit / totalInvestment) / (holdingPeriodMonths / 12)) * 100;

  return {
    airbnb: {
      results: {
        monthlyIncome: Math.round(airbnbMonthlyIncome),
        monthlyCashFlow: Math.round(airbnbMonthlyCashFlow),
        annualCashFlow: Math.round(airbnbAnnualCashFlow),
        totalROI: isFinite(airbnbTotalROI) ? Math.round(airbnbTotalROI * 10) / 10 : 0,
      }
    },
    lease: {
      results: {
        monthlyIncome: Math.round(leaseMonthlyIncome),
        monthlyCashFlow: Math.round(leaseMonthlyCashFlow),
        annualCashFlow: Math.round(leaseAnnualCashFlow),
        totalROI: isFinite(leaseTotalROI) ? Math.round(leaseTotalROI * 10) / 10 : 0,
      }
    },
    flip: {
      costBreakdown: {
        renovationBudget,
      },
      results: {
        totalInvestment: Math.round(totalInvestment),
        netProfit: Math.round(netProfit),
        annualizedROI: isFinite(annualizedROI) ? Math.round(annualizedROI * 10) / 10 : 0,
      }
    }
  };
}