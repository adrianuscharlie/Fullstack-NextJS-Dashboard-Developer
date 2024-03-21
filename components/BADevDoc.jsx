import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 20,
  },
  container: {
    flexDirection: "row",
    gap: 20,
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  heading1: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  heading2: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  heading3: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
});

const BADevDoc = ({ formData }) => {
  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <Document style={{ width: "100%", height: "100%" }}>
        <Page size="A4" style={styles.page}>
          <View >
            <Text style={styles.text}>{formData.project_name}</Text>
            <Text>{formData.date}</Text>
            <Text>{formData.deskripsi}</Text>
            <Text>{formData.jenisTransaksi}</Text>
            <Text>{formData.lokasi}</Text>
            <Text>{formData.message}</Text>
            <Text>{formData.noDokumen}</Text>
            <Text>{formData.peserta}</Text>
            <Text>{formData.programTerkait}</Text>
            <Text>{formData.version}</Text>
            <Text>{formData.attachment}</Text>
          </View>
        </Page>
        <Page size="A4" style={styles.page}>
          {/* Table structure */}
          <View style={styles.table}>
            {/* Table header */}
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text>Header 1</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Header 2</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Header 3</Text>
              </View>
            </View>
            {/* Table rows */}
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text>Data 1</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Data 2</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Data 3</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text>Data 4</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Data 5</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Data 6</Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default BADevDoc;
