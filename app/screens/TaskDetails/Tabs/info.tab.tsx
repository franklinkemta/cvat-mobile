import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View, Modal} from 'react-native';
import {DataTable, Paragraph, Caption, Appbar} from 'react-native-paper';

// import our custom preview grid package
import PreviewGrid from 'react-native-preview-images';

import ImageViewer from 'react-native-image-zoom-viewer';

import {theme} from '/theme';

// import utils
import {formatImagesSources} from '/utils';

type InfoTabProps = {
  route: any;
  navigation?: any;
};

export const InfoTab = (props: InfoTabProps) => {
  const task: Task = props.route.params;

  const [listImageIndex, setListImageIndex] = useState(0);
  const [imgViewModal, setImgViewModal] = useState(false);

  // const previewGridRef = createRef<PreviewGrid>(); // The ref to manipulate parent GridView from its child components

  // Render the grid image gallery under the PreviewGrid on ImageList item press
  const _renderImagesGallery = () => (
    <ImageViewer
      imageUrls={formatImagesSources(task.images)}
      index={listImageIndex}
      renderIndicator={() => <></>}
      renderHeader={_galleryHeader}
      enableSwipeDown={false}
      saveToLocalByLongPress={false}
      useNativeDriver={true}
    />
  );

  const _galleryTitle = (currentIndex: number | undefined): any => {
    const itemsCount: number = task.images.length;
    const index: number = currentIndex != undefined ? currentIndex + 1 : 0;
    return `${index}/${itemsCount}`;
  };

  const _galleryHeader = (currentIndex: number | undefined) => {
    // format index to display (A/B)
    const index: number = currentIndex != undefined ? currentIndex + 1 : 0;
    return (
      <Appbar theme={theme} style={styles.galleryHeader}>
        <Appbar.BackAction onPress={() => setImgViewModal(false)} />
        <Appbar.Content title={_galleryTitle(currentIndex)} />
      </Appbar>
    );
  };

  return (
    <ScrollView style={styles.scrollview}>
      <View style={styles.heading}>
        <Paragraph style={styles.paragraph}>{task.name}</Paragraph>
        <Caption style={[styles.paragraph, styles.caption]}>
          Please refer to the desription below
        </Caption>
      </View>
      <DataTable>
        <DataTable.Row style={styles.tableRow}>
          <DataTable.Cell style={styles.tableTitleCell}>
            <Text style={styles.tableTitle}>Total photos</Text>
          </DataTable.Cell>
          <DataTable.Cell style={styles.tableValueCell}>
            <Text style={styles.tableValue}>{task.images.length | 0}</Text>
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row style={styles.tableRow}>
          <DataTable.Cell style={styles.tableTitleCell}>
            <Text style={styles.tableTitle}>Create Date</Text>
          </DataTable.Cell>
          <DataTable.Cell style={styles.tableValueCell}>
            <Text style={styles.tableValue}>{task.createDate}</Text>
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row style={styles.tableRow}>
          <DataTable.Cell style={styles.tableTitleCell}>
            <Text style={styles.tableTitle}>Last Update</Text>
          </DataTable.Cell>
          <DataTable.Cell style={styles.tableValueCell}>
            <Text style={styles.tableValue}>{task.updateDate}</Text>
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row style={styles.tableRow}>
          <DataTable.Cell style={styles.tableTitleCell}>
            <Text style={styles.tableTitle}>Author</Text>
          </DataTable.Cell>
          <DataTable.Cell style={styles.tableValueCell}>
            <Text style={styles.tableValue}>{task.author.name}</Text>
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row style={styles.tableRow}>
          <DataTable.Cell style={styles.tableTitleCell}>
            <Text style={styles.tableTitle}>Status</Text>
          </DataTable.Cell>
          <DataTable.Cell style={styles.tableValueCell}>
            <Text style={styles.tableValue}>
              {task.completed ? 'Completed' : 'Pending'}
            </Text>
          </DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row style={styles.tableRow}>
          <DataTable.Cell style={styles.tableTitleCell}>
            <Text style={styles.tableTitle}>Total results</Text>
          </DataTable.Cell>
          <DataTable.Cell style={styles.tableValueCell}>
            <Text style={styles.tableValue}>
              {task.results?.length ? task.results.length : 'Not set'}
            </Text>
          </DataTable.Cell>
        </DataTable.Row>
      </DataTable>
      <PreviewGrid
        title={task.name}
        onImageListItemTap={(index: number) => {
          setListImageIndex(index);
          setImgViewModal(true);
        }}
        images={formatImagesSources(task.images)}></PreviewGrid>
      <View style={styles.modalView}>
        <Modal
          visible={imgViewModal}
          animationType="fade"
          transparent={false}
          onRequestClose={() => setImgViewModal(false)}>
          {_renderImagesGallery()}
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollview: {flex: 1, paddingHorizontal: theme.paddingXDefault},
  modalView: {
    alignItems: 'center',
    flex: 1,
  },
  heading: {
    paddingVertical: 30,
    borderBottomWidth: theme.borderDefault, // 0.3,
    borderBottomColor: theme.colors.primary, // 'lightgrey',
  },
  paragraph: {
    fontWeight: 'bold',
    fontSize: 15,
    // paddingHorizontal: 10,
    justifyContent: 'center',
    textAlign: 'center',
  },
  caption: {
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
  table: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tableRow: {
    borderBottomWidth: theme.borderDefault, // 0.3,
    borderBottomColor: theme.colors.border, // 'lightgrey',
  },
  tableTitleCell: {},
  tableValueCell: {},
  tableTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'grey',
  },
  tableValue: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'black',
  },
  galleryHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: theme.colors.transparent,
  },
});
