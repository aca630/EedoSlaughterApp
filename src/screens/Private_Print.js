import { BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';
import moment from 'moment-timezone';
import axios from 'axios';
import GetToken from '../api/helpers/GetToken';
import { hsdLogo } from '../components/ReceiptLogo';

/**
 * ============================================================
 * 🔧 PRINT OPTIONS
 * ============================================================
 */
const OPT = {
  codepage: 25,
  encoding: 'windows-1254',
  fonttype: 1,
  heigthtimes: 1,
};

/**
 * ============================================================
 * PRIVATE RECEIPT PRINTER
 * ------------------------------------------------------------
 * File: screens/Private_Print.js
 *
 * PURPOSE:
 * - Print EXACT private transaction receipt
 * - ID-based (audit-safe)
 * - MUST match History View totals
 *
 * INPUT:
 * - transaction_id (REQUIRED)
 * ============================================================
 */
const printPrivateReceipt = async (transaction_id) => {

  // ✅ VALIDATION MUST BE INSIDE FUNCTION
  if (!transaction_id) {
    console.log('❌ Print aborted: transaction_id is required');
    return;
  }

  try {
    const auth = await GetToken();

    const ApiResponse = await axios.get(
      `http://192.168.1.202:8000/api/private_transaction/compute-by-id/${transaction_id}`,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Accept: 'application/json',
        },
      }
    );

    const data = ApiResponse?.data?.data;

    if (!data) {
      console.log('❌ No data retrieved for print.');
      return;
    }

    /**
     * ==================================================
     * 🧠 VISIBILITY FLAGS (MATCH HISTORY VIEW)
     * ==================================================
     */
    const hasSmallAnimals =
      (data.heads?.small ?? 0) > 0 ||
      (data.animals?.small_kilos ?? 0) > 0 ||
      (data.animals?.goat_heads ?? 0) > 0 ||
      (data.animals?.hog_heads ?? 0) > 0;

    const hasLargeAnimals =
      (data.heads?.large ?? 0) > 0 ||
      (data.animals?.large_kilos ?? 0) > 0 ||
      (data.animals?.cow_heads ?? 0) > 0 ||
      (data.animals?.carabao_heads ?? 0) > 0;

    /**
     * ==================================================
     * 🖼 LOGO
     * ==================================================
     */
    await BluetoothEscposPrinter.printPic(hsdLogo, { width: 500 });

    /**
     * ==================================================
     * 🏷 HEADER
     * ==================================================
     */
    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
    await BluetoothEscposPrinter.printText(`PRIVATE TRANSACTION RECEIPT\n\n`, OPT);

    /**
     * ==================================================
     * 📄 BASIC DETAILS
     * ==================================================
     */
    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);

    await BluetoothEscposPrinter.printColumn(
      [16, 16],
      [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      ['OR #:', data.or_no],
      OPT
    );

    await BluetoothEscposPrinter.printColumn(
      [16, 16],
      [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      ['AGENCY:', data.agency],
      OPT
    );

    await BluetoothEscposPrinter.printColumn(
      [16, 16],
      [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      ['PAYOR:', data.owner],
      OPT
    );

    await BluetoothEscposPrinter.printColumn(
      [12, 20],
      [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      ['DATE:', moment(data.created_at).tz('Asia/Taipei').format('MMM-DD-YYYY HH:mm')],
      OPT
    );

    await BluetoothEscposPrinter.printText(`\n`, OPT);

    /**
     * ==================================================
     * 🐾 ANIMAL DETAILS (REFERENCE ONLY)
     * ==================================================
     */
    if (hasSmallAnimals || hasLargeAnimals) {
      await BluetoothEscposPrinter.printText(`DETAILS\n`, OPT);

      if (hasSmallAnimals) {
        await BluetoothEscposPrinter.printText(`\nSMALL CATTLES\n`, OPT);
        data.heads.small > 0 && await BluetoothEscposPrinter.printText(`Heads : ${data.heads.small}\n`, OPT);
        data.animals.small_kilos > 0 && await BluetoothEscposPrinter.printText(`Kilos : ${data.animals.small_kilos}\n`, OPT);
        data.animals.goat_heads > 0 && await BluetoothEscposPrinter.printText(`Goat  : ${data.animals.goat_heads}\n`, OPT);
        data.animals.hog_heads > 0 && await BluetoothEscposPrinter.printText(`Hog   : ${data.animals.hog_heads}\n`, OPT);
      }

      if (hasLargeAnimals) {
        await BluetoothEscposPrinter.printText(`\nLARGE CATTLES\n`, OPT);
        data.heads.large > 0 && await BluetoothEscposPrinter.printText(`Heads : ${data.heads.large}\n`, OPT);
        data.animals.large_kilos > 0 && await BluetoothEscposPrinter.printText(`Kilos : ${data.animals.large_kilos}\n`, OPT);
        data.animals.cow_heads > 0 && await BluetoothEscposPrinter.printText(`Cow   : ${data.animals.cow_heads}\n`, OPT);
        data.animals.carabao_heads > 0 && await BluetoothEscposPrinter.printText(`Carabao : ${data.animals.carabao_heads}\n`, OPT);
      }

      await BluetoothEscposPrinter.printText(`--------------------------------\n`, OPT);
    }

    /**
     * ==================================================
     * 💰 CHARGES
     * ==================================================
     */
    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
    await BluetoothEscposPrinter.printText(`NATURE OF COLLECTION / AMOUNT\n`, OPT);
    await BluetoothEscposPrinter.printText(`--------------------------------\n`, OPT);

    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
    await BluetoothEscposPrinter.printColumn([24, 8], [0, 2], ['CORRAL FEE (CF)', data.charges.cf.toFixed(2)], OPT);
    await BluetoothEscposPrinter.printColumn([24, 8], [0, 2], ['SLAUGHTER FEE (SF)', data.charges.sf.toFixed(2)], OPT);
    await BluetoothEscposPrinter.printColumn([24, 8], [0, 2], ['SLAUGHTER PERMIT (SPF)', data.charges.spf.toFixed(2)], OPT);
    await BluetoothEscposPrinter.printColumn([24, 8], [0, 2], ['POST MORTEM FEE (PMF)', data.charges.pmf.toFixed(2)], OPT);

    await BluetoothEscposPrinter.printText(`--------------------------------\n`, OPT);
    await BluetoothEscposPrinter.printColumn([24, 8], [0, 2], ['TOTAL', data.charges.total.toFixed(2)], OPT);

    /**
     * ==================================================
     * 🧾 QR CODE
     * ==================================================
     */
    await BluetoothEscposPrinter.printText(`\n\n`, OPT);
    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);

    await BluetoothEscposPrinter.printQRCode(
      `PRIVATE-${data.or_no}-${moment().format('YYMMDD-HHmmss')}`,
      200,
      BluetoothEscposPrinter.ERROR_CORRECTION.L
    );

    await BluetoothEscposPrinter.printText(`\nScan for verification\n\nTHANK YOU!\n\n`, OPT);

  } catch (error) {
    console.log('❌ Error printing Private Receipt:', error);
  }
};

export default printPrivateReceipt;
