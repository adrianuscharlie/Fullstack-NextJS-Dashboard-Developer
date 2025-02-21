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
const styles = StyleSheet.create({
  page: {
    flexDirection: "col",
    backgroundColor: "white",
    padding: 25,
    fontFamily: "Helvetica",
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
    borderCollapse: "collapse",
    borderColor: "gray",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  row: { flexDirection: "row" },
  header: {
    backgroundColor: "#305494",
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  color: {
    backgroundColor: "#e0e4f4",
  },
  cell: {
    borderStyle: "solid",
    borderWidth: 1,
    padding: 5,
    fontSize: 10,
  },
  smallCell: { width: "25%" },
  largeCell: { width: "75%" },
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
    flexDirection: "column",
    alignSelf: "stretch", 
    justifyContent:"start",
    width: "100%", 
    marginBottom: 10,
  },
  imageAttachment: {
    objectFit: "contain",
    justifyContent:"start",
    alignItems:"flex-start",
    width: "100%", 
    height: 200, 
    marginBottom: 10, 
  },
});

const formatDate = (dateString) => {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const dateObj = new Date(dateString);
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = "2024"; // Force the year to 2024

  return `${day} ${month} ${year}`;
};
const BAUATDoc = ({ formData }) => {
  const ttd =
    formData.ttd.split("\n").length > 1 ? formData.ttd.split("\n") : [];
  return (
    <Document
      style={{ width: "100%", height: "100%" }}
      title={`BA UAT ${formData.noDokumen}`}
    >
      <Page style={styles.page} orientation="landscape">
        <View
          style={{
            flexDirection: "col",
            gap: "5",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 30,
            // border: "2pt solid black",
            margin: 20,
            marginTop: 10,
          }}
        >
          <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.row}>
              <Text
                style={[
                  styles.cell,
                  {
                    width: "25%",
                    color: "#305494",
                    fontSize: 24,
                    height: "100px",
                    display: "flex",
                    flexDirection: "column",
                  },
                ]}
              >
                {"User" + "\n" + "Acceptance" + "\n" + "Test (UAT)"}
              </Text>
            </View>

            <View style={[styles.row]}>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}>Unit</Text>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}>Nama Aplikasi</Text>
            </View>
            <View style={[styles.row, styles.color]}>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                PT KLIK INDOMARET SUKSES
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formData.project_name}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}>DEPT.IT</Text>
              <Text style={[styles.cell, { width: "25%" }]}>PIC UAT</Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                Versi Aplikasi
              </Text>
            </View>
            <View style={[styles.row, styles.color]}>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}>IT KIS</Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formData.picUAT}
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formData.version}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                No. PRPK / Tanggal / PIC PRPK
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                DokTek / API / Table (jika ada)
              </Text>
            </View>
            <View style={[styles.row, styles.color]}>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formData.prpk}
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formData.doktekAPI}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                No. Memo CPS / Tanggal (jika ada)
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                No. Memo CIA / Tanggal (jika ada)
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
            </View>
            <View style={[styles.row, styles.color]}>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formData.prpk}
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formData.cia}
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}>Nama Project</Text>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
            </View>
            <View style={[styles.row, styles.color]}>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formData.project_name}
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}>Tanggal UAT</Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {"UAT Ke (1/2/3/4)"}
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
            </View>
            <View style={[styles.row, styles.color]}>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formData.tglUAT}
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formData.uatKE}
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {"Lokasi (HO/Cabang/Regional)"}
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {"Tanggal live (dd-mon-yyyy)"}
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
            </View>
            <View style={[styles.row, styles.color]}>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formData.lokasi}
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formatDate(formData.tglLive)}
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}>Peserta UAT</Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                Departemen Peserta
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
              <Text style={[styles.cell, { width: "25%" }]}>
                {formData.peserta.split(";").map((orang, index) => (
                  <>
                    {index + 1}.{orang.split(":")[0]}
                    {"\n"}
                  </>
                ))}
              </Text>
              <Text
                style={[
                  styles.cell,
                  { width: "25%", display: "flex", flexDirection: "column" },
                ]}
              >
                {formData.peserta.split(";").map((orang, index) => (
                  <>
                    {index + 1}.{orang.split(":")[1]}
                    {"\n"}
                  </>
                ))}
              </Text>
              <Text style={[styles.cell, { width: "25%" }]}></Text>
            </View>
          </View>
        </View>
      </Page>
      <Page size={"A4"} orientation="landscape" style={styles.page}>
        <View style={styles.table}>
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.cell, { width: "5%" }]}>No</Text>
            <Text style={[styles.cell, { width: "15%" }]}>Deskripsi</Text>
            <Text style={[styles.cell, { width: "20%" }]}>Skenario Test</Text>
            <Text style={[styles.cell, { width: "15%" }]}>
              Hasil yang Diharapkan
            </Text>
            <Text style={[styles.cell, { width: "15%" }]}>
              Referensi Gambar / Hasil Laporan
            </Text>
            <Text style={[styles.cell, { width: "15%" }]}>Pass/Fail</Text>
            <Text style={[styles.cell, { width: "15%" }]}>Keterangan</Text>
          </View>
          <View style={[styles.row, styles.header]}>
            <Text
              style={[
                styles.row,
                styles.color,
                { width: "100%", color: "black" },
              ]}
            >
              Application 1
            </Text>
          </View>
          {formData.attachments &&
            formData.attachments.map((detail, index) => (
              <View key={index} style={[styles.row]}>
                <Text style={[styles.cell, { width: "5%" }, styles.color]}>
                  {index + 1}
                </Text>
                <Text style={[styles.cell, { width: "15%" }, styles.color]}>
                  {detail.desc}
                </Text>
                <Text style={[styles.cell, { width: "20%" }]}>
                  {detail.skenario}
                </Text>
                <Text style={[styles.cell, { width: "15%" }, styles.color]}>
                  {detail.expected}
                </Text>
                <Text style={[styles.cell, { width: "15%" }]}>
                  {detail.title}
                </Text>
                <Text style={[styles.cell, { width: "15%" }, styles.color]}>
                  {detail.passFail}
                </Text>
                <Text style={[styles.cell, { width: "15%" }]}>
                  {detail.keterangan}
                </Text>
              </View>
            ))}
        </View>
      </Page>
      <Page size={"A4"} orientation="landscape" style={styles.page}>
        <View style={styles.table}>
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.cell, { width: "100%" }]}>
              Referensi Gambar / Laporan
            </Text>
          </View>
          <View style={styles.imageContainer}>
            {formData.attachments.map((attachment, index) => (
              <View key={index} style={styles.imageContainer}>
              {attachment.images && attachment.images.length > 0 ? (
                <>
                  <Text style={{ marginBottom: 10, fontSize: 14 }}>
                    {attachment.title}
                  </Text>
                  {attachment.images.map((image, imgIndex) => (
                    <Image
                      key={imgIndex}
                      style={styles.imageAttachment}
                      src={image}
                    />
                  ))}
                </>
              ) : null}
            </View>
            ))}
          </View>
        </View>
      </Page>
      <Page size={"A4"} orientation="landscape" style={styles.page}>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text
              style={[
                styles.cell,
                {
                  width: "20%",
                  fontSize: 24,
                  backgroundColor: "green",
                  fontWeight: "bold",
                },
              ]}
            >
              APPROVAL
            </Text>
          </View>

          <View style={[styles.row]}>
            {formData.ttd.split(";").map((peserta, index) => (
              <Text
                key={index}
                style={[
                  styles.cell,
                  { flex: 1, textAlign: "center" },
                  styles.header,
                ]}
              >
                {peserta.split(":")[1]}
              </Text>
            ))}
          </View>
          <View style={[styles.row]}>
            {formData.ttd.split(";").map((peserta, index) => (
              <Text
                key={index}
                style={[styles.cell, { flex: 1, textAlign: "center" }]}
              >
                {formatDate(formData.tglUAT)}
              </Text>
            ))}
          </View>
          <View style={[styles.row, { height: "100px" }]}>
            {formData.ttd.split(";").map((peserta, index) => (
              <Text key={index} style={[styles.cell, { flex: 1 }]}></Text>
            ))}
          </View>
          <View style={[styles.row, { backgroundColor: "#e0e4f4" }]}>
            {formData.ttd.split(";").map((peserta, index) => (
              <Text
                key={index}
                style={[
                  styles.cell,
                  { flex: 1, textAlign: "center", fontWeight: "bold" },
                ]}
              >
                {peserta.split(":")[0] + "\n" + peserta.split(":")[2]}
              </Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default BAUATDoc;
