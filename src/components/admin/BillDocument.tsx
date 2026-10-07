import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Order, Settings } from "@/types";

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 11, color: "#4A0E1C" },
  brand: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  logo: { width: 48, height: 48, marginRight: 10 },
  title: { fontSize: 20, marginBottom: 4 },
  muted: { color: "#7a4a3a", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  tableHead: { flexDirection: "row", borderBottom: "1 solid #D4A017", marginTop: 16 },
  cell: { flex: 1 },
  total: { marginTop: 16, fontSize: 14 },
});

export function BillDocument({
  order,
  settings,
}: {
  order: Order;
  settings: Settings;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.brand}>
          {settings.logo_url ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={settings.logo_url} style={styles.logo} />
          ) : null}
          <View>
            <Text style={styles.title}>{settings.shop_name || "Diwali Diya Store"}</Text>
          </View>
        </View>
        <Text style={styles.muted}>{settings.store_address}</Text>
        <Text style={styles.muted}>Phone: {settings.call_number}</Text>
        <Text>Bill no: {order.order_id}</Text>
        <Text>Date: {new Date(order.created_at).toLocaleDateString("en-IN")}</Text>
        <Text style={{ marginTop: 12 }}>Bill to: {order.customer_name}</Text>
        <Text>{order.phone}</Text>
        <Text>{order.address}</Text>
        <Text>{order.pincode}</Text>
        <View style={styles.tableHead}>
          <Text style={styles.cell}>Code</Text>
          <Text style={{ flex: 2 }}>Item</Text>
          <Text style={styles.cell}>Qty</Text>
          <Text style={styles.cell}>Price</Text>
        </View>
        {order.items.map((item, index) => (
          <View key={`${item.productId}-${index}`} style={styles.row}>
            <Text style={styles.cell}>{item.code || "-"}</Text>
            <Text style={{ flex: 2 }}>
              {item.name}
              {item.color || item.pack ? ` (${[item.color, item.pack].filter(Boolean).join(", ")})` : ""}
            </Text>
            <Text style={styles.cell}>{item.qty}</Text>
            <Text style={styles.cell}>Rs {item.price * item.qty}</Text>
          </View>
        ))}
        <Text style={styles.total}>Total: Rs {order.total}</Text>
        <Text style={{ marginTop: 8 }}>Cash on Delivery</Text>
        <Text style={{ marginTop: 16 }}>Thank you. Light up a happy Diwali.</Text>
      </Page>
    </Document>
  );
}
