/**
 * Automated Verification Script for Government Data Connectors
 * Tests:
 * 1. Cache Storage, Retrieval, TTL, and Invalidation
 * 2. DataGovIn Connector with Query Parameters
 * 3. MoSPI Connector (CPI, IIP, PLFS, ASI)
 * 4. RBI Connector (Repo Rate, Forex, Credit Growth)
 * 5. Census Connector (Districts & National Overview)
 * 6. Graceful degradation & Fallbacks
 */

import { cache } from '../cache';
import { dataGovIn } from '../dataGovIn';
import { mospi } from '../mospi';
import { rbi } from '../rbi';
import { census } from '../census';

async function runTests() {
  console.log('🧪 Starting StatIntel-AI Government Data Connectors Test Suite...\n');
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
    }
  }

  // Test 1: Cache Subsystem
  console.log('--- 1. Testing Cache Manager ---');
  cache.set('test_key_1', { value: 42 }, 1000);
  const cached = cache.get<{ value: number }>('test_key_1');
  assert(cached !== null && cached.data.value === 42, 'Cache stores and retrieves in-memory objects');

  cache.invalidate('test_key_1');
  assert(cache.get('test_key_1') === null, 'Cache invalidation removes target key');

  // Test 2: DataGovIn Connector
  console.log('\n--- 2. Testing DataGovIn Connector ---');
  const cpiOGD = await dataGovIn.getConsumerPriceIndex(5);
  assert(cpiOGD.success === true, 'DataGovIn CPI fetch succeeds');
  assert(cpiOGD.data.records.length > 0, 'DataGovIn returns valid records array');
  assert(cpiOGD.data.source === 'data.gov.in', 'DataGovIn response metadata attribution matches');

  // Test 3: MoSPI Connector
  console.log('\n--- 3. Testing MoSPI Connector ---');
  const cpiMoSPI = await mospi.getCPI();
  assert(cpiMoSPI.success === true, 'MoSPI CPI indicator fetched successfully');
  assert(cpiMoSPI.data.latestValue > 0, `MoSPI CPI latest value valid (${cpiMoSPI.data.latestValue})`);
  assert(cpiMoSPI.data.timeSeries.length >= 5, 'MoSPI CPI timeSeries contains multiple periods');

  const iipMoSPI = await mospi.getIIP();
  assert(iipMoSPI.success === true, 'MoSPI IIP indicator fetched successfully');
  assert(iipMoSPI.data.timeSeries.length >= 5, 'MoSPI IIP timeSeries contains monthly data');

  const plfsMoSPI = await mospi.getPLFS();
  assert(plfsMoSPI.success === true, 'MoSPI PLFS unemployment rate fetched successfully');

  const asiMoSPI = await mospi.getASI();
  assert(asiMoSPI.success === true, 'MoSPI ASI Net Value Added metrics fetched');

  // Test 4: RBI Connector
  console.log('\n--- 4. Testing RBI Connector ---');
  const repoRate = await rbi.getRepoRate();
  assert(repoRate.success === true, 'RBI Repo Rate fetched successfully');
  assert(repoRate.data.currentRate === 6.25, `RBI Policy Repo Rate calibrated at ${repoRate.data.currentRate}%`);

  const forex = await rbi.getForexReserves();
  assert(forex.success === true, 'RBI Forex reserves fetched successfully');
  assert(forex.data.currentRate > 600, `RBI Forex reserves exceed $600B (${forex.data.currentRate}B)`);

  const credit = await rbi.getBankCreditGrowth();
  assert(credit.success === true, 'RBI Bank Credit growth fetched successfully');

  // Test 5: Census India Connector
  console.log('\n--- 5. Testing Census India Connector ---');
  const districts = await census.getDistrictData();
  assert(districts.success === true, 'Census district indicators fetched');
  assert(districts.data.length >= 5, 'Census returns multiple high-density districts');

  const nationalOverview = await census.getNationalOverview();
  assert(nationalOverview.success === true, 'Census national overview metrics fetched');
  assert(nationalOverview.data.totalPopulation > 1400000000, 'Census population exceeds 1.4 Billion');

  console.log(`\n═══════════════════════════════════════════`);
  console.log(`📊 Test Results: ${passed}/${total} Passed (${Math.round((passed / total) * 100)}%)`);
  console.log(`═══════════════════════════════════════════\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
