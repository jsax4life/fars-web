"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/utility/Sidebar";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import Navbar from "../nav/Navbar";
import { useAnalysis, AnalysisTypeResponse } from "@/hooks/useAnalysis";
import { useClients } from "@/hooks/useClient";
import {
  useBankAccounts,
  type ClientBankAccountResponse,
} from "@/hooks/useBankAccount";

interface Transaction {
  no: string;
  class?: string;
  transDate?: string;
  valueDate?: string;
  transactionDescription?: string;
  tellerNo?: string;
  chequeNo?: string;
  debit?: string;
  credit?: string;
  balance?: string;
  remarks?: string;
  entryDate?: string;
  transType?: string;
  originalValue?: string;
  currency?: string;
  confirmation?: string;
  cleared?: string;
  exchangeRate?: string;
  clearance?: string;
  // For CMF Analysis Table
  cotCharge?: string;
  vatCharge?: string;
  total?: string;
  cotChargeAnalysis?: string; // To differentiate from the initial COT Charge
  vatChargeAnalysis?: string; // To differentiate from the initial VAT Charge
  totalCotVat?: string;
  difference?: string;
  sumExcess?: string;
  period?: string;
  rate?: string;
  intOnExcess?: string;
  // For Short Term Loan Analysis Table
  openingDate?: string;
  maturityDate?: string;
  principalAmount?: string;
  principalLiquid?: string;
  plate?: string;
  intChg?: string;
  intReacmal?: string;
  // For Term Loan Analysis
  effectDate?: string;
  intRate?: string;
  principalBalance?: string;
  monthlyPrincipal?: string;
  interestCharge?: string;
  penalCharge?: string;
  totalMonthlyDue?: string;
  cumulativeTotal?: string;
  principalRepayment?: string;
  interestLiquidity?: string;
  personalChange?: string;
  cumExcess?: string;
  // For Interest Analysis
  blank?: string;
  days?: string;
  odLimit?: string;
  crRate?: string;
  excRate?: string;
  crInterestCal?: string;
  whtCal?: string;
  drInterestCal?: string;
  excInterestCal?: string;
  monthlyCrInt?: string;
  monthlyWHT?: string;
  monthlyDrInt?: string;
  periods?: string;
}

type AnalysisType =
  | "CMF"
  | "ST Loan"
  | "STIP Loan"
  | "LT Loan"
  | "Interest"
  | "Debit"
  | "Credit"
  | "Collateral"
  | "Fees"
  | null;

const AccountDetails = () => {
  const [selectedAnalysisType, setSelectedAnalysisType] =
    useState<AnalysisType | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [displayAnalysisTable, setDisplayAnalysisTable] = useState(false);
  const [isAnalysisTypeDropdownOpen, setIsAnalysisTypeDropdownOpen] =
    useState(false);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [isAccountsDropdownOpen, setIsAccountsDropdownOpen] = useState(false);
  const [analysisTypes, setAnalysisTypes] = useState<AnalysisTypeResponse[]>([]);
  const [isLoadingAnalysisTypes, setIsLoadingAnalysisTypes] = useState(false);
  const { getAnalysisTypes } = useAnalysis();
  const { getClients } = useClients();
  const [clients, setClients] = useState<any[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const { getBankAccountsByClient } = useBankAccounts();
  const [clientAccounts, setClientAccounts] = useState<
    ClientBankAccountResponse[]
  >([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);

  useEffect(() => {
    const fetchAnalysisTypes = async () => {
      try {
        setIsLoadingAnalysisTypes(true);
        const types = await getAnalysisTypes();
        setAnalysisTypes(types);
      } catch (error) {
        console.error("Failed to load analysis types", error);
      } finally {
        setIsLoadingAnalysisTypes(false);
      }
    };

    // Load analysis types once on mount
    fetchAnalysisTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoadingClients(true);
        const data = await getClients();
        if (Array.isArray(data)) {
          setClients(data);
        } else if (data && Array.isArray((data as any).data)) {
          setClients((data as any).data);
        }
      } catch (error) {
        console.error("Failed to load clients", error);
      } finally {
        setIsLoadingClients(false);
      }
    };

    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load accounts whenever a client is selected
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!selectedClientId) {
        setClientAccounts([]);
        setSelectedBank(null);
        setSelectedAccounts([]);
        return;
      }

      try {
        setIsLoadingAccounts(true);
        const accounts = await getBankAccountsByClient(selectedClientId);
        setClientAccounts(accounts || []);
      } catch (error) {
        console.error("Failed to load client accounts", error);
      } finally {
        setIsLoadingAccounts(false);
      }
    };

    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClientId]);
  const banks = [
    "UBA",
    "First Bank",
    "Sterling Bank",
    "Union Bank",
    "GT Bank",
    "Polaris Bank",
  ];
  const accounts = [
    "Account A",
    "Account B",
    "Account C",
    "Account D",
    "Account E",
    "Account F",
  ];

  const handleAnalyzeClick = () => {
    setDisplayAnalysisTable(true);
  };

  const handleAccountSelect = (account: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(account)
        ? prev.filter((acc) => acc !== account)
        : [...prev, account]
    );
  };
const cmfAnalysisData: Transaction[] = [
    {
      no: "01",
      class: "IT",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Principal LIQ-4088666231730001",
      cotCharge: "44,897,985.89",
      vatCharge: "44,897,985.89",
      total: "44,897,985.89",
      cotChargeAnalysis: "44,897,985.89",
      vatChargeAnalysis: "44,897,985.89",
      totalCotVat: "44,897,985.89",
      difference: "0.00",
      sumExcess: "44,897,985.89",
      period: "30 days",
      rate: "5%",
      intOnExcess: "224,489.93"
    },
    {
      no: "02",
      class: "CD",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Babatope babajide Oluosla",
      cotCharge: "0.00",
      vatCharge: "0.00",
      total: "0.00",
      cotChargeAnalysis: "0.00",
      vatChargeAnalysis: "0.00",
      totalCotVat: "0.00",
      difference: "0.00",
      sumExcess: "0.00",
      period: "15 days",
      rate: "5%",
      intOnExcess: "0.00"
    },
    {
      no: "03",
      class: "MC",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Babatope babajide Oluosla",
      cotCharge: "0.00",
      vatCharge: "0.00",
      total: "0.00",
      cotChargeAnalysis: "0.00",
      vatChargeAnalysis: "0.00",
      totalCotVat: "0.00",
      difference: "0.00",
      sumExcess: "0.00",
      period: "10 days",
      rate: "5%",
      intOnExcess: "0.00"
    },
    {
      no: "04",
      class: "MC",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Electronic Money transfer Levy",
      cotCharge: "465,897.00",
      vatCharge: "465,897.00",
      total: "465,897.00",
      cotChargeAnalysis: "465,897.00",
      vatChargeAnalysis: "465,897.00",
      totalCotVat: "465,897.00",
      difference: "0.00",
      sumExcess: "465,897.00",
      period: "25 days",
      rate: "5%",
      intOnExcess: "2,329.49"
    },
    {
      no: "05",
      class: "ET",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "SMS Charge, November 2023",
      cotCharge: "0.00",
      vatCharge: "0.00",
      total: "0.00",
      cotChargeAnalysis: "0.00",
      vatChargeAnalysis: "0.00",
      totalCotVat: "0.00",
      difference: "0.00",
      sumExcess: "0.00",
      period: "30 days",
      rate: "5%",
      intOnExcess: "0.00"
    },
    {
      no: "06",
      class: "CD",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Transfer Charge - FCO 246929009NC",
      cotCharge: "0.00",
      vatCharge: "0.00",
      total: "0.00",
      cotChargeAnalysis: "0.00",
      vatChargeAnalysis: "0.00",
      totalCotVat: "0.00",
      difference: "0.00",
      sumExcess: "0.00",
      period: "20 days",
      rate: "5%",
      intOnExcess: "0.00"
    },
    {
      no: "07",
      class: "ET",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "IBTC Place, Walter karrington, Lagos",
      cotCharge: "0.00",
      vatCharge: "0.00",
      total: "0.00",
      cotChargeAnalysis: "0.00",
      vatChargeAnalysis: "0.00",
      totalCotVat: "0.00",
      difference: "0.00",
      sumExcess: "0.00",
      period: "15 days",
      rate: "5%",
      intOnExcess: "0.00"
    },
    {
      no: "08",
      class: "MC",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Electronic Money Transfer Levy",
      cotCharge: "465,897.00",
      vatCharge: "465,897.00",
      total: "465,897.00",
      cotChargeAnalysis: "465,897.00",
      vatChargeAnalysis: "465,897.00",
      totalCotVat: "465,897.00",
      difference: "0.00",
      sumExcess: "465,897.00",
      period: "30 days",
      rate: "5%",
      intOnExcess: "2,329.49"
    },
    {
      no: "09",
      class: "COT",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "SMS Charge, Octoberr 2023",
      cotCharge: "0.00",
      vatCharge: "0.00",
      total: "0.00",
      cotChargeAnalysis: "0.00",
      vatChargeAnalysis: "0.00",
      totalCotVat: "0.00",
      difference: "0.00",
      sumExcess: "0.00",
      period: "30 days",
      rate: "5%",
      intOnExcess: "0.00"
    },
    {
      no: "10",
      class: "VAT",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Principal LIQ-4088666231730001",
      cotCharge: "465,897.00",
      vatCharge: "465,897.00",
      total: "465,897.00",
      cotChargeAnalysis: "465,897.00",
      vatChargeAnalysis: "465,897.00",
      totalCotVat: "465,897.00",
      difference: "0.00",
      sumExcess: "465,897.00",
      period: "30 days",
      rate: "5%",
      intOnExcess: "2,329.49"
    },
  ];

  const shortTermLoanAnalysisData: Transaction[] = [
    {
      no: "01",
      openingDate: "02 - 04 - 2023",
      maturityDate: "02 - 05 - 2023",
      period: "30 days",
      principalAmount: "44,897,985.89",
      principalLiquid: "44,897,985.89",
      plate: "44,897,985.89",
      intChg: "224,489.93",
      intReacmal: "224,489.93",
      difference: "0.00",
      sumExcess: "44,897,985.89",
      periods: "23-12-25",
      rate: "5%",
      intOnExcess: "224,489.93"
    },
    {
      no: "02",
      openingDate: "15 - 04 - 2023",
      maturityDate: "15 - 05 - 2023",
      period: "30 days",
      principalAmount: "0.00",
      principalLiquid: "0.00",
      plate: "0.00",
      intChg: "0.00",
      intReacmal: "0.00",
      difference: "0.00",
      sumExcess: "0.00",
       periods: "23-12-25",
      rate: "5%",
      intOnExcess: "0.00"
    },
    {
      no: "03",
      openingDate: "20 - 04 - 2023",
      maturityDate: "20 - 05 - 2023",
      period: "30 days",
      principalAmount: "0.00",
      principalLiquid: "0.00",
      plate: "0.00",
      intChg: "0.00",
      intReacmal: "0.00",
      difference: "0.00",
      sumExcess: "0.00",
       periods: "23-12-25",
      rate: "5%",
      intOnExcess: "0.00"
    },
    {
      no: "04",
      openingDate: "25 - 04 - 2023",
      maturityDate: "25 - 05 - 2023",
      period: "30 days",
      principalAmount: "465,897.00",
      principalLiquid: "465,897.00",
      plate: "465,897.00",
      intChg: "2,329.49",
      intReacmal: "2,329.49",
      difference: "0.00",
      sumExcess: "465,897.00",
       periods: "23-12-25",
      rate: "5%",
      intOnExcess: "2,329.49"
    },
    {
      no: "05",
      openingDate: "01 - 05 - 2023",
      maturityDate: "01 - 06 - 2023",
      period: "31 days",
      principalAmount: "0.00",
      principalLiquid: "0.00",
      plate: "0.00",
      intChg: "0.00",
      intReacmal: "0.00",
      difference: "0.00",
      sumExcess: "0.00",
       periods: "23-12-25",
      rate: "5%",
      intOnExcess: "0.00"
    },
    {
      no: "06",
      openingDate: "05 - 05 - 2023",
      maturityDate: "05 - 06 - 2023",
      period: "31 days",
      principalAmount: "0.00",
      principalLiquid: "0.00",
      plate: "0.00",
      intChg: "0.00",
      intReacmal: "0.00",
      difference: "0.00",
      sumExcess: "0.00",
       periods: "23-12-25",
      rate: "5%",
      intOnExcess: "0.00"
    },
    {
      no: "07",
      openingDate: "10 - 05 - 2023",
      maturityDate: "10 - 06 - 2023",
      period: "31 days",
      principalAmount: "0.00",
      principalLiquid: "0.00",
      plate: "0.00",
      intChg: "0.00",
      intReacmal: "0.00",
      difference: "0.00",
      sumExcess: "0.00",
       periods: "23-12-25",
      rate: "5%",
      intOnExcess: "0.00"
    },
    {
      no: "08",
      openingDate: "15 - 05 - 2023",
      maturityDate: "15 - 06 - 2023",
      period: "31 days",
      principalAmount: "465,897.00",
      principalLiquid: "465,897.00",
      plate: "465,897.00",
      intChg: "2,329.49",
      intReacmal: "2,329.49",
      difference: "0.00",
      sumExcess: "465,897.00",
       periods: "23-12-25",
      rate: "5%",
      intOnExcess: "2,329.49"
    },
    {
      no: "09",
      openingDate: "20 - 05 - 2023",
      maturityDate: "20 - 06 - 2023",
      period: "31 days",
      principalAmount: "0.00",
      principalLiquid: "0.00",
      plate: "0.00",
      intChg: "0.00",
      intReacmal: "0.00",
      difference: "0.00",
      sumExcess: "0.00",
       periods: "23-12-25",
      rate: "5%",
      intOnExcess: "0.00"
    },
    {
      no: "10",
      openingDate: "25 - 05 - 2023",
      maturityDate: "25 - 06 - 2023",
      period: "31 days",
      principalAmount: "465,897.00",
      principalLiquid: "465,897.00",
      plate: "465,897.00",
      intChg: "2,329.49",
      intReacmal: "2,329.49",
      difference: "0.00",
      sumExcess: "465,897.00",
       periods: "23-12-25",
      rate: "5%",
      intOnExcess: "2,329.49"
    },
  ];

  const shortTermLoanAnalysisWithInterestData: Transaction[] = [
    {
      no: "01",
      class: "IT",
      transDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Principal LIQ-4088666231730001",
      tellerNo: "N/A",
      chequeNo: "Nil",
      debit: "44,897,985.89",
      credit: "0.00",
      balance: "44,897,985.89"
    },
    {
      no: "02",
      class: "CD",
      transDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Babatope babajide Oluosla",
      tellerNo: "UI0002022",
      chequeNo: "N/A",
      debit: "100,000.00",
      credit: "0.00",
      balance: "44,997,985.89"
    },
    {
      no: "03",
      class: "MC",
      transDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Babatope babajide Oluosla",
      tellerNo: "UI0002022",
      chequeNo: "N/A",
      debit: "20,000.00",
      credit: "0.00",
      balance: "45,017,985.89"
    },
    {
      no: "04",
      class: "MC",
      transDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Electronic Money transfer Levy",
      tellerNo: "N/A",
      chequeNo: "Nil",
      debit: "465,897.00",
      credit: "0.00",
      balance: "45,483,882.89"
    },
    {
      no: "05",
      class: "ET",
      transDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "SMS Charge, November 2023",
      tellerNo: "N/A",
      chequeNo: "Nil",
      debit: "0.00",
      credit: "0.00",
      balance: "45,483,882.89"
    },
    {
      no: "06",
      class: "CD",
      transDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Transfer Charge - FCO 246929009NC",
      tellerNo: "N/A",
      chequeNo: "Nil",
      debit: "0.00",
      credit: "0.00",
      balance: "45,483,882.89"
    },
    {
      no: "07",
      class: "ET",
      transDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "IBTC Place, Walter karrington, Lagos",
      tellerNo: "N/A",
      chequeNo: "Nil",
      debit: "0.00",
      credit: "0.00",
      balance: "45,483,882.89"
    },
    {
      no: "08",
      class: "MC",
      transDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Electronic Money Transfer Levy",
      tellerNo: "N/A",
      chequeNo: "Nil",
      debit: "465,897.00",
      credit: "0.00",
      balance: "45,949,779.89"
    },
    {
      no: "09",
      class: "COT",
      transDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "SMS Charge, Octoberr 2023",
      tellerNo: "N/A",
      chequeNo: "Nil",
      debit: "0.00",
      credit: "0.00",
      balance: "45,949,779.89"
    },
    {
      no: "10",
      class: "VAT",
      transDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Principal LIQ-4088666231730001",
      tellerNo: "N/A",
      chequeNo: "Nil",
      debit: "465,897.00",
      credit: "0.00",
      balance: "46,415,676.89"
    },
  ];

  const TermLoanAnalysisData: Transaction[] = [
    {
      no: "01",
      openingDate: "02 - 04 - 2023",
      maturityDate: "02 - 04 - 2024",
      effectDate: "02 - 04 - 2023",
      period: "12 months",
      intRate: "5%",
      principalAmount: "44,897,985.89",
      principalBalance: "44,897,985.89",
      monthlyPrincipal: "3,741,498.82",
      interestCharge: "224,489.93",
      penalCharge: "0.00",
      totalMonthlyDue: "3,965,988.75",
      cumulativeTotal: "3,965,988.75",
      principalRepayment: "3,741,498.82",
      interestLiquidity: "224,489.93",
      personalChange: "0.00",
      difference: "0.00",
       sumExcess: "44,897,985.89",
      periods: "23-12-25",
      rate: "5%",
      intOnExcess: "224,489.93"
    },
    {
      no: "02",
      openingDate: "02 - 05 - 2023",
      maturityDate: "02 - 04 - 2024",
      effectDate: "02 - 05 - 2023",
      period: "11 months",
      intRate: "5%",
      principalAmount: "41,156,487.07",
      principalBalance: "41,156,487.07",
      monthlyPrincipal: "3,741,498.82",
      interestCharge: "205,782.44",
      penalCharge: "0.00",
      totalMonthlyDue: "3,947,281.26",
      cumulativeTotal: "7,913,270.01",
      principalRepayment: "7,482,997.64",
      interestLiquidity: "430,272.37",
      personalChange: "0.00",
      difference: "0.00",
      sumExcess: "44,897,985.89",
      periods: "23-12-25",
      rate: "5%",
      intOnExcess: "205,782.44"
    },
    {
      no: "03",
      openingDate: "02 - 06 - 2023",
      maturityDate: "02 - 04 - 2024",
      effectDate: "02 - 06 - 2023",
      period: "10 months",
      intRate: "5%",
      principalAmount: "37,414,988.25",
      principalBalance: "37,414,988.25",
      monthlyPrincipal: "3,741,498.82",
      interestCharge: "187,074.94",
      penalCharge: "0.00",
      totalMonthlyDue: "3,928,573.76",
      cumulativeTotal: "11,841,843.77",
      principalRepayment: "11,224,496.46",
      interestLiquidity: "617,347.31",
      personalChange: "0.00",
      difference: "0.00",
      sumExcess: "44,897,985.89",
      periods: "23-12-25",
      rate: "5%",
      intOnExcess: "187,074.94"
    },
    {
      no: "04",
      openingDate: "02 - 07 - 2023",
      maturityDate: "02 - 04 - 2024",
      effectDate: "02 - 07 - 2023",
      period: "9 months",
      intRate: "5%",
      principalAmount: "33,673,489.43",
      principalBalance: "33,673,489.43",
      monthlyPrincipal: "3,741,498.82",
      interestCharge: "168,367.45",
      penalCharge: "0.00",
      totalMonthlyDue: "3,909,866.27",
      cumulativeTotal: "15,751,710.04",
      principalRepayment: "14,965,995.28",
      interestLiquidity: "785,714.76",
      personalChange: "0.00",
      difference: "0.00",
      sumExcess: "44,897,985.89",
      periods: "23-12-25",
      rate: "5%",
      intOnExcess: "168,367.45"
    },
    {
      no: "05",
      openingDate: "02 - 08 - 2023",
      maturityDate: "02 - 04 - 2024",
      effectDate: "02 - 08 - 2023",
      period: "8 months",
      intRate: "5%",
      principalAmount: "29,931,990.61",
      principalBalance: "29,931,990.61",
      monthlyPrincipal: "3,741,498.82",
      interestCharge: "149,659.95",
      penalCharge: "0.00",
      totalMonthlyDue: "3,891,158.77",
      cumulativeTotal: "19,642,868.81",
      principalRepayment: "18,707,494.10",
      interestLiquidity: "935,374.71",
      personalChange: "0.00",
      difference: "0.00",
       sumExcess: "44,897,985.89",
      periods: "23-12-25",
      rate: "5%",
      intOnExcess: "149,659.95"
    },
    {
      no: "06",
      openingDate: "02 - 09 - 2023",
      maturityDate: "02 - 04 - 2024",
      effectDate: "02 - 09 - 2023",
      period: "7 months",
      intRate: "5%",
      principalAmount: "26,190,491.79",
      principalBalance: "26,190,491.79",
      monthlyPrincipal: "3,741,498.82",
      interestCharge: "130,952.46",
      penalCharge: "0.00",
      totalMonthlyDue: "3,872,451.28",
      cumulativeTotal: "23,515,320.09",
      principalRepayment: "22,448,992.92",
      interestLiquidity: "1,066,327.17",
      personalChange: "0.00",
      difference: "0.00",
       sumExcess: "44,897,985.89",
      periods: "23-12-25",
      rate: "5%",
      intOnExcess: "130,952.46"
    },
    {
      no: "07",
      openingDate: "02 - 10 - 2023",
      maturityDate: "02 - 04 - 2024",
      effectDate: "02 - 10 - 2023",
      period: "6 months",
      intRate: "5%",
      principalAmount: "22,448,992.97",
      principalBalance: "22,448,992.97",
      monthlyPrincipal: "3,741,498.82",
      interestCharge: "112,244.96",
      penalCharge: "0.00",
      totalMonthlyDue: "3,853,743.78",
      cumulativeTotal: "27,369,063.87",
      principalRepayment: "26,190,491.74",
      interestLiquidity: "1,178,572.13",
      personalChange: "0.00",
      difference: "0.00",
      sumExcess: "44,897,985.89",
      periods: "23-12-25",
      rate: "5%",
      intOnExcess: "112,244.96"
    },
    {
      no: "08",
      openingDate: "02 - 11 - 2023",
      maturityDate: "02 - 04 - 2024",
      effectDate: "02 - 11 - 2023",
      period: "5 months",
      intRate: "5%",
      principalAmount: "18,707,494.15",
      principalBalance: "18,707,494.15",
      monthlyPrincipal: "3,741,498.82",
      interestCharge: "93,537.47",
      penalCharge: "0.00",
      totalMonthlyDue: "3,835,036.29",
      cumulativeTotal: "31,204,100.16",
      principalRepayment: "29,931,990.56",
      interestLiquidity: "1,272,109.60",
      personalChange: "0.00",
      difference: "0.00",
      sumExcess: "44,897,985.89",
      periods: "23-12-25",
      rate: "5%",
      intOnExcess: "93,537.47"
    },
    {
      no: "09",
      openingDate: "02 - 12 - 2023",
      maturityDate: "02 - 04 - 2024",
      effectDate: "02 - 12 - 2023",
      period: "4 months",
      intRate: "5%",
      principalAmount: "14,965,995.33",
      principalBalance: "14,965,995.33",
      monthlyPrincipal: "3,741,498.82",
      interestCharge: "74,829.98",
      penalCharge: "0.00",
      totalMonthlyDue: "3,816,328.80",
      cumulativeTotal: "35,020,428.96",
      principalRepayment: "33,673,489.38",
      interestLiquidity: "1,346,939.58",
      personalChange: "0.00",
      difference: "0.00",
       sumExcess: "44,897,985.89",
      periods: "23-12-25",
      rate: "5%",
      intOnExcess: "74,829.98"
    },
    {
      no: "10",
      openingDate: "02 - 01 - 2024",
      maturityDate: "02 - 04 - 2024",
      effectDate: "02 - 01 - 2024",
      period: "3 months",
      intRate: "5%",
      principalAmount: "11,224,496.51",
      principalBalance: "11,224,496.51",
      monthlyPrincipal: "3,741,498.82",
      interestCharge: "56,122.48",
      penalCharge: "0.00",
      totalMonthlyDue: "3,797,621.30",
      cumulativeTotal: "38,818,050.26",
      principalRepayment: "37,414,988.20",
      interestLiquidity: "1,403,062.06",
      personalChange: "0.00",
      difference: "0.00",
       sumExcess: "44,897,985.89",
      periods: "23-12-25",
      rate: "5%",
      intOnExcess: "56,122.48"
    },
  ];

  const interestAnalysisData: Transaction[] = [
    {
      no: "01",
      class: "IT",
      transDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Principal LIQ-4088666231730001",
      tellerNo: "N/A",
      debit: "44,897,985.89",
      credit: "0.00",
      balance: "44,897,985.89",
      blank: "",
      days: "30",
      odLimit: "50,000,000.00",
      crRate: "3%",
      intRate: "5%",
      excRate: "2%",
      crInterestCal: "0.00",
      whtCal: "0.00",
      drInterestCal: "224,489.93",
      excInterestCal: "89,795.97",
      monthlyCrInt: "0.00",
      monthlyWHT: "0.00",
      monthlyDrInt: "224,489.93"
    },
    {
      no: "02",
      class: "CD",
      transDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Babatope babajide Oluosla",
      tellerNo: "UI0002022",
      debit: "100,000.00",
      credit: "0.00",
      balance: "44,997,985.89",
      blank: "",
      days: "30",
      odLimit: "50,000,000.00",
      crRate: "3%",
      intRate: "5%",
      excRate: "2%",
      crInterestCal: "0.00",
      whtCal: "0.00",
      drInterestCal: "224,989.93",
      excInterestCal: "89,995.97",
      monthlyCrInt: "0.00",
      monthlyWHT: "0.00",
      monthlyDrInt: "224,989.93"
    },
    {
      no: "03",
      class: "MC",
      transDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Babatope babajide Oluosla",
      tellerNo: "UI0002022",
      debit: "20,000.00",
      credit: "0.00",
      balance: "45,017,985.89",
      blank: "",
      days: "30",
      odLimit: "50,000,000.00",
      crRate: "3%",
      intRate: "5%",
      excRate: "2%",
      crInterestCal: "0.00",
      whtCal: "0.00",
      drInterestCal: "225,089.93",
      excInterestCal: "90,035.97",
      monthlyCrInt: "0.00",
      monthlyWHT: "0.00",
      monthlyDrInt: "225,089.93"
    },
    {
      no: "04",
      class: "MC",
      transDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Electronic Money transfer Levy",
      tellerNo: "N/A",
      debit: "465,897.00",
      credit: "0.00",
      balance: "45,483,882.89",
      blank: "",
      days: "30",
      odLimit: "50,000,000.00",
      crRate: "3%",
      intRate: "5%",
      excRate: "2%",
      crInterestCal: "0.00",
      whtCal: "0.00",
      drInterestCal: "227,419.41",
      excInterestCal: "90,967.77",
      monthlyCrInt: "0.00",
      monthlyWHT: "0.00",
      monthlyDrInt: "227,419.41"
    },
    {
      no: "05",
      class: "ET",
      transDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "SMS Charge, November 2023",
      tellerNo: "N/A",
      debit: "0.00",
      credit: "0.00",
      balance: "45,483,882.89",
      blank: "",
      days: "30",
      odLimit: "50,000,000.00",
      crRate: "3%",
      intRate: "5%",
      excRate: "2%",
      crInterestCal: "0.00",
      whtCal: "0.00",
      drInterestCal: "227,419.41",
      excInterestCal: "90,967.77",
      monthlyCrInt: "0.00",
      monthlyWHT: "0.00",
      monthlyDrInt: "227,419.41"
    },
    {
      no: "06",
      class: "CD",
      transDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Transfer Charge - FCO 246929009NC",
      tellerNo: "N/A",
      debit: "0.00",
      credit: "0.00",
      balance: "45,483,882.89",
      blank: "",
      days: "30",
      odLimit: "50,000,000.00",
      crRate: "3%",
      intRate: "5%",
      excRate: "2%",
      crInterestCal: "0.00",
      whtCal: "0.00",
      drInterestCal: "227,419.41",
      excInterestCal: "90,967.77",
      monthlyCrInt: "0.00",
      monthlyWHT: "0.00",
      monthlyDrInt: "227,419.41"
    },
    {
      no: "07",
      class: "ET",
      transDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "IBTC Place, Walter karrington, Lagos",
      tellerNo: "N/A",
      debit: "0.00",
      credit: "0.00",
      balance: "45,483,882.89",
      blank: "",
      days: "30",
      odLimit: "50,000,000.00",
      crRate: "3%",
      intRate: "5%",
      excRate: "2%",
      crInterestCal: "0.00",
      whtCal: "0.00",
      drInterestCal: "227,419.41",
      excInterestCal: "90,967.77",
      monthlyCrInt: "0.00",
      monthlyWHT: "0.00",
      monthlyDrInt: "227,419.41"
    },
    {
      no: "08",
      class: "MC",
      transDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Electronic Money Transfer Levy",
      tellerNo: "N/A",
      debit: "465,897.00",
      credit: "0.00",
      balance: "45,949,779.89",
      blank: "",
      days: "30",
      odLimit: "50,000,000.00",
      crRate: "3%",
      intRate: "5%",
      excRate: "2%",
      crInterestCal: "0.00",
      whtCal: "0.00",
      drInterestCal: "229,748.90",
      excInterestCal: "91,899.56",
      monthlyCrInt: "0.00",
      monthlyWHT: "0.00",
      monthlyDrInt: "229,748.90"
    },
    {
      no: "09",
      class: "COT",
      transDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "SMS Charge, Octoberr 2023",
      tellerNo: "N/A",
      debit: "0.00",
      credit: "0.00",
      balance: "45,949,779.89",
      blank: "",
      days: "30",
      odLimit: "50,000,000.00",
      crRate: "3%",
      intRate: "5%",
      excRate: "2%",
      crInterestCal: "0.00",
      whtCal: "0.00",
      drInterestCal: "229,748.90",
      excInterestCal: "91,899.56",
      monthlyCrInt: "0.00",
      monthlyWHT: "0.00",
      monthlyDrInt: "229,748.90"
    },
    {
      no: "10",
      class: "VAT",
      transDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      transactionDescription: "Principal LIQ-4088666231730001",
      tellerNo: "N/A",
      debit: "465,897.00",
      credit: "0.00",
      balance: "46,415,676.89",
      blank: "",
      days: "30",
      odLimit: "50,000,000.00",
      crRate: "3%",
      intRate: "5%",
      excRate: "2%",
      crInterestCal: "0.00",
      whtCal: "0.00",
      drInterestCal: "232,078.38",
      excInterestCal: "92,831.35",
      monthlyCrInt: "0.00",
      monthlyWHT: "0.00",
      monthlyDrInt: "232,078.38"
    },
  ];
  const reconstructedStatementTransactions: Transaction[] = [
    {
      no: "01",
      entryDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      tellerNo: "N/A",
      transactionDescription: "Principal LIQ-4088666231730001",
      transType: "Cash/Cheque",
      chequeNo: "Nil",
      originalValue: "44,897,985.89",
      debit: "44,897,985.89",
      credit: "0.00",
    },
    {
      no: "02",
      entryDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      tellerNo: "UI0002022",
      transactionDescription: "Babatope babajide Oluosla",
      transType: "Cash",
      chequeNo: "N/A",
      originalValue: "100,000.00",
      debit: "100,000.00",
      credit: "0.00",
    },
    {
      no: "03",
      entryDate: "02 - 04 - 2023",
      valueDate: "02 - 04 - 2023",
      tellerNo: "UI0002022",
      transactionDescription: "Babatope babajide Oluosla",
      transType: "Transfer",
      chequeNo: "N/A",
      originalValue: "20,000.00",
      debit: "20,000.00",
      credit: "0.00",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 ">
      <div className="hidden md:block fixed h-full w-64">
        <Sidebar />
      </div>

      <div className="flex-1 md:ml-64 overflow-auto mt-16 md:mt-0">
        <Navbar />
        <div className="flex-1  p-4 md:p-6">
          <div className="bg-white rounded-md shadow-md p-4 md:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-700 text-xl font-semibold">
                Account Selection
              </h2>
              <button
                onClick={handleAnalyzeClick}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-md focus:outline-none focus:shadow-outline-orange active:bg-orange-700"
              >
                Analyze
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Analysis Type Dropdown */}
              <div className="relative">
                <label
                  htmlFor="analysisType"
                  className="block text-sm font-medium text-gray-700 sr-only"
                >
                  Analysis Type
                </label>
                <button
                  id="analysisType"
                  className="w-full bg-white text-black border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm flex justify-between items-center"
                  onClick={() =>
                    setIsAnalysisTypeDropdownOpen(!isAnalysisTypeDropdownOpen)
                  }
                >
                  {selectedAnalysisType || "Select Analysis"}
                  <svg
                    className="-mr-0.5 ml-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isAnalysisTypeDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full  bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {isLoadingAnalysisTypes && (
                      <div className="py-2 px-3 text-sm text-gray-500">
                        Loading analysis types...
                      </div>
                    )}
                    {!isLoadingAnalysisTypes && analysisTypes.length === 0 && (
                      <div className="py-2 px-3 text-sm text-gray-500">
                        No analysis types available
                      </div>
                    )}
                    {!isLoadingAnalysisTypes &&
                      analysisTypes.map((type) => (
                        <div
                          key={type.id}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-orange-100"
                          onClick={() => {
                            setSelectedAnalysisType(type.name as AnalysisType);
                            setIsAnalysisTypeDropdownOpen(false);
                          }}
                        >
                          <span className="font-normal text-black block truncate">
                            {type.name}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Clients Dropdown */}
              <div className="relative">
                <label
                  htmlFor="clients"
                  className="block text-sm font-medium text-gray-700 sr-only"
                >
                  Clients
                </label>
                <button
                  id="clients"
                  className="w-full bg-white text-black border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm flex justify-between items-center"
                  onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
                >
                  {selectedClient || "Select Client"}
                  <svg
                    className="-mr-0.5 ml-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isClientDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm max-h-60">
                    {isLoadingClients && (
                      <div className="py-2 px-3 text-sm text-gray-500">
                        Loading clients...
                      </div>
                    )}
                    {!isLoadingClients && clients.length === 0 && (
                      <div className="py-2 px-3 text-sm text-gray-500">
                        No clients available
                      </div>
                    )}
                    {!isLoadingClients &&
                      clients.map((client: any) => {
                        const displayName =
                          client.companyName ||
                          `${client.firstName || ""} ${
                            client.lastName || ""
                          }`.trim() ||
                          client.email ||
                          client.username ||
                          "Unnamed client";

                        return (
                          <div
                            key={client.id}
                            className="cursor-pointer select-none text-black relative py-2 pl-3 pr-9 hover:bg-orange-100 flex items-center"
                            onClick={() => {
                              setSelectedClient(displayName);
                              setSelectedClientId(client.id);
                              setIsClientDropdownOpen(false);
                            }}
                          >
                            <img
                              src={
                                client.avatarUrl ||
                                "https://gravatar.com/avatar/48c3863a0f03a81d67916d28fdaa0ea6?s=80&d=mp&r=pg"
                              }
                              alt="Client Avatar"
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <span className="font-normal block truncate">
                              {displayName}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Bank Dropdown */}
              <div className="relative">
                <label
                  htmlFor="bank"
                  className="block text-sm font-medium text-gray-700 sr-only"
                >
                  Bank
                </label>
                <button
                  id="bank"
                  className="w-full bg-white border text-black border-gray-300 rounded-md shadow-sm px-4 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm flex justify-between items-center"
                  onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                >
                  {selectedBank || "Select Bank"}
                  <svg
                    className="-mr-0.5 ml-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isBankDropdownOpen && (
                  <div className="absolute z-10 mt-1 text-black w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm max-h-60">
                    {isLoadingAccounts && (
                      <div className="py-2 px-3 text-sm text-gray-500">
                        Loading banks...
                      </div>
                    )}
                    {!isLoadingAccounts &&
                      Array.from(
                        new Map(
                          clientAccounts
                            .filter((acc) => acc.bank)
                            .map((acc) => [acc.bank!.id, acc.bank!])
                        ).values()
                      ).map((bank) => (
                        <div
                          key={bank.id}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-orange-100"
                          onClick={() => {
                            setSelectedBank(bank.name);
                            setIsBankDropdownOpen(false);
                          }}
                        >
                          <span className="font-normal block truncate">
                            {bank.name}
                          </span>
                        </div>
                      ))}
                    {!isLoadingAccounts && clientAccounts.length === 0 && (
                      <div className="py-2 px-3 text-sm text-gray-500">
                        No banks available for this client
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Accounts Dropdown */}
              <div className="relative">
                <label
                  htmlFor="accounts"
                  className="block text-sm font-medium text-gray-700 sr-only"
                >
                  Accounts
                </label>
                <button
                  id="accounts"
                  className="w-full bg-white border text-black border-gray-300 rounded-md shadow-sm px-4 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm flex justify-between items-center"
                  onClick={() =>
                    setIsAccountsDropdownOpen(!isAccountsDropdownOpen)
                  }
                >
                  {selectedAccounts.length > 0
                    ? `${selectedAccounts.length} selected`
                    : "Select Accounts"}
                  <svg
                    className="-mr-0.5 ml-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isAccountsDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm max-h-60">
                    {isLoadingAccounts && (
                      <div className="py-2 px-3 text-sm text-gray-500">
                        Loading accounts...
                      </div>
                    )}
                    {!isLoadingAccounts && clientAccounts.length === 0 && (
                      <div className="py-2 px-3 text-sm text-gray-500">
                        No accounts available for this client
                      </div>
                    )}
                    {!isLoadingAccounts && clientAccounts.length > 0 && (
                      <>
                        <div
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-orange-100"
                          onClick={() => {
                            const allIds = clientAccounts.map((a) => a.id);
                            if (selectedAccounts.length === allIds.length) {
                              setSelectedAccounts([]);
                            } else {
                              setSelectedAccounts(allIds);
                            }
                          }}
                        >
                          <span className="font-normal text-black block truncate">
                            Select All
                          </span>
                        </div>
                        {clientAccounts.map((account) => (
                          <div
                            key={account.id}
                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-orange-100 flex items-center"
                            onClick={() => handleAccountSelect(account.id)}
                          >
                            <input
                              type="radio"
                              checked={selectedAccounts.includes(account.id)}
                              readOnly
                              className="form-radio h-4 w-4 text-orange-600 transition duration-150 ease-in-out"
                            />
                            <span className="ml-2 text-black font-normal block truncate">
                              {account.accountNumber} - {account.accountName}
                            </span>
                          </div>
                        ))}
                        <div className="p-2">
                          <button
                            onClick={() => setIsAccountsDropdownOpen(false)}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-4 rounded focus:outline-none focus:shadow-outline-orange active:bg-orange-700"
                          >
                            Ok
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {displayAnalysisTable && selectedAnalysisType === "CMF" && (
            <div className="bg-white rounded-md shadow-md p-4 md:p-6 mb-6">
                <div className=" flex flex-col items-center justify-center  p-4">
     
      <h1
        className="text-sm sm:text-md md:text-lg lg:text-xl font-bold text-center mb-0.5 sm:mb-1 rounded-md p-2"
        style={{ color: '#e67e22', fontFamily: 'Inter, sans-serif' }}
      >
        CAMF ANALYSIS
      </h1>
      <div
        className="w-20 sm:w-24 md:w-28 lg:w-32 h-0.5 sm:h-1 rounded-full"
        style={{ backgroundColor: '#e67e22' }}
      ></div>
    </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        S/N
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Class
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Value Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Transaction Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        COT Charge
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        VAT Charge
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        TOTAL
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider"
                      >
                        COT Charge
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider"
                      >
                        VAT Charge
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider"
                      >
                        TOTAL COT/VAT
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Difference
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium  text-red-500 uppercase tracking-wider"
                      >
                        SUM EXCESS
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium  text-red-500  uppercase tracking-wider"
                      >
                        PERIOD
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium  text-red-500  uppercase tracking-wider"
                      >
                        RATE
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium  text-red-500  uppercase tracking-wider"
                      >
                        INT ON EXCESS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cmfAnalysisData.map((row) => (
                      <tr key={row.no}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {row.no}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.valueDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.transactionDescription}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.cotCharge}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.vatCharge}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                          {row.cotChargeAnalysis}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                          {row.vatChargeAnalysis}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                          {row.totalCotVat}
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.difference}
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                          {row.sumExcess}
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                          {row.period}
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                          {row.rate}
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                          {row.intOnExcess}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {displayAnalysisTable && selectedAnalysisType === "ST Loan" && (
            <div className="bg-white rounded-md shadow-md p-4 md:p-6 mb-6">
                <div className=" flex flex-col items-center justify-center  p-4">
     
      <h1
        className="text-sm sm:text-md md:text-lg lg:text-xl font-bold text-center mb-0.5 sm:mb-1 rounded-md p-2"
        style={{ color: '#e67e22', fontFamily: 'Inter, sans-serif' }}
      >
        SHORT TERM LOAN ANALYSIS 
      </h1>
      <div
        className="w-20 sm:w-24 md:w-28 lg:w-32 h-0.5 sm:h-1 rounded-full"
        style={{ backgroundColor: '#e67e22' }}
      ></div>
    </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        S/N
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Opening Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Maturity Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Period
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Principal Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Principal Liquid
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Plate
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Int. Chg.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Int. Reacmal.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Difference
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium  text-red-500 uppercase tracking-wider"
                      >
                        SUM EXCESS
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium  text-red-500  uppercase tracking-wider"
                      >
                        PERIOD
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium  text-red-500  uppercase tracking-wider"
                      >
                        RATE
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium  text-red-500  uppercase tracking-wider"
                      >
                        INT ON EXCESS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {shortTermLoanAnalysisData.map((row) => (
                      <tr key={row.no}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {row.no}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.openingDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.maturityDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.period}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.principalAmount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.principalLiquid}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.plate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.intChg}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.intReacmal}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.difference}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                          {row.sumExcess}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                          {row.periods}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                          {row.rate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                          {row.intOnExcess}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                  <span>Showing 1 to 10 of 38 entries</span>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100">
                      &lt;
                    </button>
                    <button className="px-3 py-1 border border-orange-500 rounded-md bg-orange-500 text-white">
                      1
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100">
                      2
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100">
                      &gt;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
 {displayAnalysisTable && selectedAnalysisType === "STIP Loan" && (
            <div className="bg-white rounded-md shadow-md p-4 md:p-6 mb-6">
               <div className=" flex flex-col items-center justify-center  p-4">
     
      <h1
        className="text-sm sm:text-md md:text-lg lg:text-xl font-bold text-center mb-0.5 sm:mb-1 rounded-md p-2"
        style={{ color: '#e67e22', fontFamily: 'Inter, sans-serif' }}
      >
        SHORT TERM LOAN ANALYSIS WITH INSTALMENT REPAYMENT
      </h1>
      <div
        className="w-20 sm:w-24 md:w-28 lg:w-32 h-0.5 sm:h-1 rounded-full"
        style={{ backgroundColor: '#e67e22' }}
      ></div>
    </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        S/N
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Class
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Transaction Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Value Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Transaction Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Teller Number
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Cheque Number
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                       Debit
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                       Credit
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                       Balance
                      </th>
                      
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {shortTermLoanAnalysisWithInterestData.map((row) => (
                          <tr key={row.no}>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {row.no}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {row.class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.transDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.valueDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.transactionDescription}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.tellerNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.chequeNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.debit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.credit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.balance}
                        </td>
                       
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                  <span>Showing 1 to 10 of 38 entries</span>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100">
                      &lt;
                    </button>
                    <button className="px-3 py-1 border border-orange-500 rounded-md bg-orange-500 text-white">
                      1
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100">
                      2
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100">
                      &gt;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
           {displayAnalysisTable && selectedAnalysisType === "LT Loan" && (
            <div className="bg-white rounded-md shadow-md p-4 md:p-6 mb-6">
                <div className=" flex flex-col items-center justify-center  p-4">
     
      <h1
        className="text-sm sm:text-md md:text-lg lg:text-xl font-bold text-center mb-0.5 sm:mb-1 rounded-md p-2"
        style={{ color: '#e67e22', fontFamily: 'Inter, sans-serif' }}
      >
        TERM ANALYSIS 
      </h1>
      <div
        className="w-20 sm:w-24 md:w-28 lg:w-32 h-0.5 sm:h-1 rounded-full"
        style={{ backgroundColor: '#e67e22' }}
      ></div>
    </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        S/N
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Value Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Effect Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Period
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Int. Rate
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Principal Balance
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Monthly Principal
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Interest Charge
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Penal Charge
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total Monthly Due
                      </th>
                       <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Cumulative Total
                      </th>
                       <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Principal Repayment
                      </th>
                       <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Interest Liquidity
                      </th>
                       <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Personal Change
                      </th>
                       <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total Monthly Due
                      </th>
                       <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Difference
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium  text-red-500 uppercase tracking-wider"
                      >
                        CUM EXCESS
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium  text-red-500  uppercase tracking-wider"
                      >
                        PERIOD
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium  text-red-500  uppercase tracking-wider"
                      >
                        RATE
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium  text-red-500  uppercase tracking-wider"
                      >
                        INT ON EXCESS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {TermLoanAnalysisData.map((row) => (
                     <tr key={row.no}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {row.no}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.openingDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.maturityDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.period}
                        </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.intRate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.principalAmount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.principalBalance}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.monthlyPrincipal}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.interestCharge}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.penalCharge}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.totalMonthlyDue}
                        </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.cumulativeTotal}
                        </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.principalRepayment}
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.interestLiquidity}
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.personalChange}
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.difference}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                          {row.sumExcess}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                          {row.periods}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                          {row.rate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                          {row.intOnExcess}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                  <span>Showing 1 to 10 of 38 entries</span>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100">
                      &lt;
                    </button>
                    <button className="px-3 py-1 border border-orange-500 rounded-md bg-orange-500 text-white">
                      1
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100">
                      2
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100">
                      &gt;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
           {displayAnalysisTable && selectedAnalysisType === "Interest" && (
            <div className="bg-white rounded-md shadow-md p-4 md:p-6 mb-6">
                <div className=" flex flex-col items-center justify-center  p-4">
     
      <h1
        className="text-sm sm:text-md md:text-lg lg:text-xl font-bold text-center mb-0.5 sm:mb-1 rounded-md p-2"
        style={{ color: '#e67e22', fontFamily: 'Inter, sans-serif' }}
      >
        INTEREST ANALYSIS
      </h1>
      <div
        className="w-20 sm:w-24 md:w-28 lg:w-32 h-0.5 sm:h-1 rounded-full"
        style={{ backgroundColor: '#e67e22' }}
      ></div>
    </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        S/N
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Class
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Transaction Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Value Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Transaction Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                       Teller Number
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Debit
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Credit
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Balance
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Blank
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Debit
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Balance
                      </th>
                       <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Days
                      </th>
                       <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                       O/D Limit
                      </th>
                       <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Cr Rate
                      </th>
                       <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                       Int. Rate
                      </th>
                       <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Exc. Rate
                      </th>
                       <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Cr. Interest Cal.
                      </th>
                       <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        WHT Cal.
                      </th>
                       <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Dr. Interest Cal.
                      </th>
                       <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Exc. Interest Cal.
                      </th>
 <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Monthly Cr. Int
                      </th>
                       <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Monthly WHT
                      </th>
                       <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Monthly Dr. Int.
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {interestAnalysisData.map((row) => (
                      <tr key={row.no}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {row.no}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.transDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.valueDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.transactionDescription}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.tellerNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.debit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.credit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.balance}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.blank}
                        </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {row.days}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.odLimit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.crRate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.intRate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.excRate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.crInterestCal}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.whtCal}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.drInterestCal}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.excInterestCal}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.monthlyCrInt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.monthlyWHT}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.monthlyDrInt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.monthlyWHT}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.monthlyDrInt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                  <span>Showing 1 to 10 of 38 entries</span>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100">
                      &lt;
                    </button>
                    <button className="px-3 py-1 border border-orange-500 rounded-md bg-orange-500 text-white">
                      1
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100">
                      2
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100">
                      &gt;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {displayAnalysisTable &&
            selectedAnalysisType === "CMF" && ( // Conditional rendering for Reconstructed Statement
              <div className="bg-white rounded-md shadow-md p-4 md:p-6">
                 <div className=" flex flex-col items-center justify-center  p-4">
     
      <h1
        className="text-sm sm:text-md md:text-lg lg:text-xl font-bold text-center mb-0.5 sm:mb-1 rounded-md p-2"
        style={{ color: '#e67e22', fontFamily: 'Inter, sans-serif' }}
      >
        RECONSTRUCTED STATEMENT
      </h1>
      <div
        className="w-20 sm:w-24 md:w-28 lg:w-32 h-0.5 sm:h-1 rounded-full"
        style={{ backgroundColor: '#e67e22' }}
      ></div>
    </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          S/N
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Entry Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Transaction Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Value Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Teller Number
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Transaction Description
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Transaction Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Cheque No.
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Original Value
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Debit
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Credit
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reconstructedStatementTransactions.map((row) => (
                        <tr key={row.no}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {row.no}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.entryDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.transDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.valueDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.tellerNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.transactionDescription}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.transType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.chequeNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.originalValue}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.debit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.credit}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
