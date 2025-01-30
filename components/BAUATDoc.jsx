import React, { useState } from "react";
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
    padding: 10,
    fontFamily:"Helvetica"
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
  },
  tableRow: {
    flexDirection: "row",
    fontSize: 12,
  },
  tableCell: {
    flex: 1,
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableHeading: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign:"center"
  },
  image: {
    width: 120,
    height: 100,
    marginBottom: 10,
  },
  attachmentTable: {
    display: "table",
    fontSize: 12,
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  attachmentRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    padding: 5,
  },
  cellNo: {
    padding: 5,
    flex: 0.5, // Makes this column narrower
    textAlign: "start",
  },
  cellAttachment: {
    padding: 5,
    flex: 5, // Increases width for this column
    textAlign: "start",
  },
  cellKeterangan: {
    padding: 5,
    flex: 1, // Keeps this column narrower
    textAlign: "start",
  },
  imageContainer: {
    justifyContent: "start",
  },
  imageAttachment: {
    marginVertical: 2,
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
const BAUATDoc = ({ formData }) => {
  const ttd =formData.ttd.split("\n").length > 1 ? formData.ttd.split("\n") : [];
  return (
    <Document
      style={{ width: "100%", height: "100%" }}
      title={`BA UAT ${formData.noDokumen}`}
    >
      <Page style={styles.page}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
            padding: 20,
            paddingBottom: 10,
            paddingTop:10,
            gap: 20,
            paddingTop: 30,
            flexGrow: 1,
          }}
        >
          <Image
            src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogokis.6e7dfc79.jpg&w=1080&q=75"
            style={styles.image}
            alt={"Logo KIS"}
          />
          <Text style={{ fontSize: 25, fontWeight: "900" }}>
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
            marginBottom: 30,
            border: "2pt solid black",
            margin: 20,
            marginTop:0,
            backgroundColor: "gray",
          }}
        >
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>
            USER ACCEPTANCE TEST (UAT)
          </Text>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            No. Dokumen : {formData.noDokumen}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "col",
            gap: "5",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 50,
            // border: "2pt solid black",
            margin: 20,
          }}
        >
          <View style={styles.table}>
            {/* Table header */}
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeading}>Nama Proyek</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeading}>Jenis Transaksi</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeading}>Tanggal</Text>
              </View>
            </View>
            {/* Table rows */}
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeading}>{formData.project_name}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeading}>{formData.jenisTransaksi}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableHeading}>{formData.date}</Text>
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
            marginBottom: 50,
            margin: 20,
          }}
        >
          <View style={styles.table}>
            {/* Table header */}
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text styles={styles.tableHeading}>Informasi</Text>
              </View>
            </View>
            {/* Table rows */}
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCell, width: "25%" }}>
                <Text styles={styles.tableHeading}>Program Terkait</Text>
              </View>
              <View style={{ ...styles.tableCell, width: "75%" }}>
                <Text>{formData.programTerkait}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCell, width: "25%" }}>
                <Text styles={styles.tableHeading}>Versi</Text>
              </View>
              <View style={{ ...styles.tableCell, width: "75%" }}>
                <Text>{formData.version}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCell, width: "25%" }}>
                <Text styles={styles.tableHeading}>Jenis</Text>
              </View>
              <View style={{ ...styles.tableCell, width: "75%" }}>
                <Text>{formData.jenisTransaksi}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCell, width: "25%" }}>
                <Text styles={styles.tableHeading}>Deskripsi</Text>
              </View>
              <View style={{ ...styles.tableCell, width: "75%" }}>
                <Text>{formData.deskripsi}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCell, width: "25%" }}>
                <Text styles={styles.tableHeading}>Lokasi</Text>
              </View>
              <View style={{ ...styles.tableCell, width: "75%" }}>
                <Text>{formData.lokasi}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCell, width: "25%" }}>
                <Text styles={styles.tableHeading}>Peserta UAT</Text>
              </View>
              <View style={{ ...styles.tableCell, width: "75%" }}>
                {formData.peserta.split("\n").map((people, index) => (
                  <Text key={index + 1} styles={styles.text}>
                    {index + 1}. {people}
                  </Text>
                ))}
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
            padding: "10",
            marginBottom: 50,
            border: "1pt solid black",
            margin: 20,
          }}
        >
          <Text style={styles.text}>{formData.message}</Text>
        </View>
        <View
          style={{
            flexDirection: "col",
            gap: "5",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 50,
            // border: "2pt solid black",
            margin: 20,
          }}
        >
          <View style={styles.table}>
            {/* Table header */}
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={{fontWeight:"bold"}}>Dokumen Terlampir</Text>
              </View>
            </View>
            {/* Table rows */}
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCell, paddingLeft: 40 }}>
                {formData.attachments.map((doc, index) => (
                  <Text key={index + 1} styles={styles.text}>
                    {index + 1}. {doc.title}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Page>
      <Page break style={styles.page}>
        <View
          style={{
            // justifyContent: "center",
            // alignItems: "flex-end",
            marginBottom: 50,
            border: "1pt solid black",
            margin: 20,
            fontSize: 12,
          }}
        >
          <View
            style={{
              justifyContent: "end",
              alignItems: "flex-end",
              marginBottom: 50,
              margin: 20,
              fontSize: 12,
            }}
          >
            <Text style={{ marginBottom: 100, textAlign: "right" }}>
              Jakarta, {formatDate(formData.date)}
            </Text>
            <Text style={{fontSize:10 ,textAlign: "center" }}>{formData.support}</Text>
            <Text style={{fontSize:10 ,textAlign: "center" }}>Application QA and Implementation</Text>
          </View>
          {ttd.length > 0 && (
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 50,
                  margin: 20,
                  fontSize: 12,
                }}
              >
                <Text>Diketahui Oleh</Text>
              </View>
              <View
                style={{
                  justifyContent: "space-between",
                  textAlign: "justify",
                  marginTop: 50,
                  margin: 20,
                  fontSize: 12,
                  flexDirection: "row",
                  paddingTop: 60,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 50,
                    margin: 20,
                    fontSize: 10,
                  }}
                >
                  <Text>{ttd[0].split("|")[0]}</Text>
                  <Text>{ttd[0].split("|")[1]}</Text>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 50,
                    margin: 20,
                    fontSize: 10,
                  }}
                >
                  <Text>{ttd[1].split("|")[0]}</Text>
                  <Text>{ttd[1].split("|")[1]}</Text>
                </View>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 50,
                  margin: 20,
                  fontSize: 12,
                }}
              >
                <Text>Disetujui Oleh</Text>
              </View>

              <View
                style={{
                  justifyContent: "space-between",
                  textAlign: "justify",
                  marginTop: 50,
                  margin: 20,
                  fontSize: 10,
                  flexDirection: "row",
                  paddingTop: 60,
                }}
              >
                {ttd
                  .slice(2, 5)
                  .reverse()
                  .map((item, index) => {
                    const [name, role] = item.split("|");
                    return (
                      <View
                        key={index}
                        style={{
                          justifyContent: "between",
                          alignItems: "center",
                          marginBottom: 50,
                          margin: 10,
                          fontSize: 10,
                        }}
                      >
                        <Text>{name}</Text>
                        <Text style={{ flexWrap: "wrap" }} numberOfLines={2}>
                          {role}
                        </Text>
                      </View>
                    );
                  })}
              </View>
            </View>
          )}
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Lampiran</Text>
        <View style={styles.attachmentTable}>
          <View style={styles.attachmentRow}>
            <Text style={styles.cellNo}>No</Text>
            <Text style={styles.cellAttachment}>Lampiran</Text>
            <Text style={styles.cellKeterangan}>Hasil</Text>
          </View>
          {formData.attachments.map((attachment, index) => (
            <View style={styles.attachmentRow} key={index}>
              <Text style={styles.cellNo}>{index + 1}</Text>
              <View style={styles.cellAttachment}>
                {attachment.images && attachment.images.length > 0 ? (
                  <View style={styles.imageContainer}>
                    <Text style={{ marginBottom: 10 }}>{attachment.title}</Text>
                    {attachment.images.map((image, imgIndex) => (
                      <Image
                        key={imgIndex}
                        style={styles.imageAttachment}
                        src={image}
                      />
                    ))}
                    <Text style={{ marginBottom: 10, textAlign:"start" }}>
                      {attachment.description}
                    </Text>
                  </View>
                ) : (
                  <View>
                    <Text style={{ marginBottom: 10 ,fontWeight:"bold"}}>{attachment.title}</Text>
                    <Text style={{ marginBottom: 10 }}>
                      {attachment.description}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.cellKeterangan}>{attachment.hasil}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default BAUATDoc;
