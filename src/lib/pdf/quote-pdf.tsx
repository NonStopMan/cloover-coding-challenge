import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { Offer } from "@/lib/pricing";
import { formatEur } from "@/lib/pricing";

type QuotePdfProps = {
  quote: {
    id: string;
    fullName: string;
    email: string;
    address: string;
    monthlyConsumptionKwh: number;
    systemSizeKw: number;
    downPayment: number;
    systemPrice: number;
    principal: number;
    riskBand: string;
    offers: Offer[];
    createdAt: Date;
  };
};

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  title: { fontSize: 20, marginBottom: 8, fontWeight: "bold" },
  subtitle: { fontSize: 12, marginBottom: 20, color: "#444" },
  section: { marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  label: { color: "#555" },
  offerBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 8,
    borderRadius: 4,
  },
});

export async function renderQuotePdf(quote: QuotePdfProps["quote"]) {
  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>GreenQuote Pre-Qualification</Text>
        <Text style={styles.subtitle}>
          Quote ID: {quote.id} · {quote.createdAt.toLocaleDateString("de-DE")}
        </Text>

        <View style={styles.section}>
          <Text style={{ fontWeight: "bold", marginBottom: 6 }}>Customer</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text>{quote.fullName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text>{quote.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address</Text>
            <Text>{quote.address}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ fontWeight: "bold", marginBottom: 6 }}>System</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Monthly consumption</Text>
            <Text>{quote.monthlyConsumptionKwh} kWh</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>System size</Text>
            <Text>{quote.systemSizeKw} kW</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Down payment</Text>
            <Text>{formatEur(quote.downPayment)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>System price</Text>
            <Text>{formatEur(quote.systemPrice)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Principal</Text>
            <Text>{formatEur(quote.principal)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Risk band</Text>
            <Text>{quote.riskBand}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
            Installment offers
          </Text>
          {quote.offers.map((offer) => (
            <View key={offer.termYears} style={styles.offerBox}>
              <Text>
                {offer.termYears} years · APR {(offer.apr * 100).toFixed(1)}%
              </Text>
              <Text>Monthly payment: {formatEur(offer.monthlyPayment)}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return renderToBuffer(doc);
}
