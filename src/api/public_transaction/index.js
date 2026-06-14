/**
 * ============================================================
 * PUBLIC TRANSACTION API
 * ------------------------------------------------------------
 * File    : src/api/public_transaction/index.js
 * Purpose :
 * - API wrapper for PUBLIC slaughter transactions
 * - Mirrors private_transaction API style
 *
 * Rules :
 * - NO axios calls inside screens
 * - Token passed explicitly
 * - Flat payload (NO guessing)
 * ============================================================
 */

import axios from "axios";

/**
 * ============================================================
 * CREATE PUBLIC TRANSACTION (CASHIER — APP 1)
 * ------------------------------------------------------------
 * Endpoint :
 * POST /api/public-slaughter/cashier/create
 * ============================================================
 */
export async function postPublicCashierTransaction(auth, body) {

  const response = await axios.post(
    `${'http://192.168.1.202:8000/api/'}public-slaughter/cashier/create`,
    body,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${auth?.token}`,
      },
    }
  );

  return response;
}


/**
 * ============================================================
 * LOOKUP PENDING PUBLIC TRANSACTIONS (APP 2 ENTRY)
 * ------------------------------------------------------------
 * Endpoint :
 * GET /api/public-slaughter/lookup/pending
 *
 * Purpose :
 * - Fetch PUBLIC slaughter transactions
 * - Status = cashier_only
 * - Used by Public Lookup screen
 * ============================================================
 */
export async function getPendingPublicTransactions(auth) {

  const response = await axios.get(
    `${'http://192.168.1.202:8000/api/'}public-slaughter/lookup/pending`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${auth?.token}`,
      },
    }
  );

  return response;
}

/**
 * ============================================================
 * GET PUBLIC TRANSACTION BY ID (APP 2)
 * ------------------------------------------------------------
 * Endpoint :
 * GET /api/public-slaughter/{id}
 * ============================================================
 */
export async function getPublicTransactionById(auth, id) {

  const response = await axios.get(
    `${'http://192.168.1.202:8000/api/'}public-slaughter/${id}`,
    {
      headers: {
        'Accept': 'application/json',
        Authorization: `Bearer ${auth?.token}`,
      },
    }
  );

  return response;
}

/**
 * ============================================================
 * UPDATE PUBLIC TRANSACTION (SLAUGHTER — APP 2)
 * ============================================================
 */
export async function updatePublicSlaughterTransaction(auth, id, body) {
  const response = await axios.patch(
    `${'http://192.168.1.202:8000/api/'}public-slaughter/slaughter/${id}`,
    body,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${auth?.token}`,
      },
    }
  );

  return response;
}
