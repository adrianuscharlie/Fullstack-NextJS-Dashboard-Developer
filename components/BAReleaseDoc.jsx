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
import Logo from "../public/sol.png";
const styles = StyleSheet.create({
  page: {
    flexDirection: "col",
    backgroundColor: "white",
    padding: 25,
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
    fontSize: 11,
  },
  table: {
    display: "table",
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
    fontSize: 11,
  },
  tableCell: {
    flex: 1,
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    fontSize:11
  },
  tableHeading: {
    fontSize: 14,
    fontWeight: "bold",
  },
  image: {
    width: 120,
    height: 100,
    marginBottom: 10,
  },
});
function formatDate(inputDate) {
  // Split the input date string by '/' and create a new Date object
  const parts = inputDate.split("/");
  const date = new Date(parts[2], parts[1] - 1, parts[0]); // Month is zero-based

  // Format the date
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("id-ID", options);
}

const BAReleaseDoc = ({ formData }) => {
  console.log(formData.businessAnalyst);
  return (
    <Document
      style={{ width: "100%", height: "100%" }}
      title={`BA Release ${formData.noDokumen}`}
    >
      <Page style={styles.page}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
            padding: 20,
            paddingTop:10,
            paddingBottom:10,
            gap: 20,
            // paddingTop: 30,
          }}
        >
          <Image
            src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogokis.6e7dfc79.jpg&w=1080&q=75"
            style={styles.image}
            alt={"Logo KIS"}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            PT. KLIK INDOMARET SUKSES
          </Text>
        </View>
        <View
          style={{
            flexDirection: "col",
            gap: "5",
            justifyContent: "center",
            alignItems: "center",
            padding: "10",
            border: "2pt solid black",
            margin: 20,
            marginTop:10,
            backgroundColor: "gray",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Formulir Release Program
          </Text>
          <Text style={{ fontSize: 10, fontWeight: "bold" }}>
            No. Dokumen : {formData.noDokumen}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "col",
            gap: "5",
            justifyContent: "center",
            alignItems: "center",
            // border: "2pt solid black",
            margin: 20,
          }}
        >
          <View style={styles.table}>
            {/* Table header */}
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCell, backgroundColor: "gray" }}>
                <Text>Nama Proyek</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{formData.project_name}</Text>
              </View>
            </View>
            {/* Table rows */}
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCell, backgroundColor: "gray" }}>
                <Text>Versi Program</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{formData.version}</Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "col",
            gap: "5",
            justifyContent: "center",
            alignItems: "center",
            // border: "2pt solid black",
            margin: 20,
          }}
        >
          <View style={styles.table}>
            {/* Table header */}
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCell, backgroundColor: "gray" }}>
                <Text>Tanggal Update / Release</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{formatDate(formData.date)}</Text>
              </View>
            </View>
            {/* Table rows */}
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCell, backgroundColor: "gray" }}>
                <Text>Deskripsi Perubahan</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{formData.informasi}</Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "col",
            gap: "5",
            justifyContent: "center",
            alignItems: "center",
            // border: "2pt solid black",
            margin: 20,
            marginBottom:10,
            marginTop:10
          }}
        >
          <View style={styles.table}>
            {/* Table header */}
            <View style={styles.tableRow}>
              <View
                style={{
                  ...styles.tableCell,
                  textAlign: "center",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Text>Dibuat Oleh</Text>
              </View>
            </View>
            {/* Table rows */}
            <View style={styles.tableRow}>
              <View
                style={{
                  ...styles.tableCell,
                  textAlign: "center",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  paddingTop: 75,
                }}
              >
                <Text>IT Software Development</Text>
              </View>
              <View
                style={{
                  ...styles.tableCell,
                  textAlign: "center",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  paddingTop: 75,
                }}
              >
                <Text>IT Software Support</Text>
              </View>
            </View>
            <View
              style={{
                ...styles.tableRow,
                alignItems: "start",
                justifyContent: "flex-start",
              }}
            >
              <View style={{ ...styles.tableCell, flexBasis: "25%" }}>
                <Text>Nama</Text>
              </View>
              <View style={{ ...styles.tableCell, flexBasis: "75%" }}>
                <Text>{formData.developer}</Text>
              </View>
              <View style={{ ...styles.tableCell, flexBasis: "25%" }}>
                <Text>Nama</Text>
              </View>
              <View style={{ ...styles.tableCell, flexBasis: "75%" }}>
                <Text>{formData.support}</Text>
              </View>
            </View>
            <View
              style={{
                ...styles.tableRow,
                alignItems: "start",
                justifyContent: "flex-start",
              }}
            >
              <View style={{ ...styles.tableCell, flexBasis: "25%" }}>
                <Text>Tanggal</Text>
              </View>
              <View style={{ ...styles.tableCell, flexBasis: "75%" }}>
                <Text>{formData.date}</Text>
              </View>
              <View style={{ ...styles.tableCell, flexBasis: "25%" }}>
                <Text>Tanggal</Text>
              </View>
              <View style={{ ...styles.tableCell, flexBasis: "75%" }}>
                <Text>{formData.date}</Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "col",
            gap: "5",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
            // border: "2pt solid black",
            margin: 20,
          }}
        >
          <View style={styles.table}>
            {/* Table header */}
            <View style={styles.tableRow}>
              <View
                style={{
                  ...styles.tableCell,
                  textAlign: "center",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Text>Disetujui Oleh</Text>
              </View>
            </View>
            {/* Table rows */}
            <View style={styles.tableRow}>
              <View
                style={{
                  ...styles.tableCell,
                  textAlign: "center",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  paddingTop: 60,
                }}
              >
                <Text>IT Software Development</Text>
              </View>
              <View
                style={{
                  ...styles.tableCell,
                  textAlign: "center",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  paddingTop: 60,
                }}
              >
                <Text>IT Software Development</Text>
              </View>
              <View
                style={{
                  ...styles.tableCell,
                  textAlign: "center",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  paddingTop: 60,
                }}
              >
                <Text>IT Software Support</Text>
              </View>
            </View>
            <View
              style={{
                ...styles.tableRow,
                alignItems: "start",
                justifyContent: "flex-start",
              }}
            >
              <View style={{ ...styles.tableCell, flexBasis: "30%" }}>
                <Text>Nama</Text>
              </View>
              <View style={{ ...styles.tableCell, flexBasis: "70%" }}>
                <Text>{formData.managerDeveloper}</Text>
              </View>
              <View style={{ ...styles.tableCell, flexBasis: "30%" }}>
                <Text>Nama</Text>
              </View>
              <View style={{ ...styles.tableCell, flexBasis: "70%" }}>
                <Text>{formData.managerSupport}</Text>
              </View>
              <View style={{ ...styles.tableCell, flexBasis: "30%" }}>
                <Text>Nama</Text>
              </View>
              <View style={{ ...styles.tableCell, flexBasis: "70%" }}>
                <Text>{formData.itDirector}</Text>
              </View>
            </View>
            <View
              style={{
                ...styles.tableRow,
                alignItems: "start",
                justifyContent: "flex-start",
              }}
            >
              <View style={{ ...styles.tableCell, flexBasis: "30%" }}>
                <Text>Tanggal</Text>
              </View>
              <View style={{ ...styles.tableCell, flexBasis: "70%" }}>
                <Text>{formData.date}</Text>
              </View>
              <View style={{ ...styles.tableCell, flexBasis: "30%" }}>
                <Text>Tanggal</Text>
              </View>
              <View style={{ ...styles.tableCell, flexBasis: "70%" }}>
                <Text>{formData.date}</Text>
              </View>
              <View style={{ ...styles.tableCell, flexBasis: "30%" }}>
                <Text>Tanggal</Text>
              </View>
              <View style={{ ...styles.tableCell, flexBasis: "70%" }}>
                <Text>{formData.date}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default BAReleaseDoc;
