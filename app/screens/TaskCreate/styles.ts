import {StyleSheet} from 'react-native';
import {theme} from '/theme';

const styles = StyleSheet.create({
  scrollview: {flex: 1},
  modalView: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: theme.paddingXDefault,
    paddingBottom: '50%',
    paddingTop: 20,
  },
  heading: {
    // paddingVertical: 20,
    paddingBottom: 20,
  },
  headingIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  paragraph: {
    fontWeight: 'bold',
    fontSize: 15,
    justifyContent: 'center',
    textAlign: 'center',
  },
  caption: {
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
  formControl: {
    borderBottomWidth: theme.borderDefault,
    borderBottomColor: theme.colors.primary, // theme.colors.primary,
    marginTop: 10,
  },
  formLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'left',
  },
  formSubmit: {
    borderBottomWidth: 10, // theme.borderDefault,
  },
  formSubmitButton: {
    flex: 1,
  },
  formSelect: {
    borderBottomWidth: 10,
    marginTop: 10,
    color: theme.colors.caption,
    backgroundColor: theme.colors.surface,
  },
  selectOption: {
    backgroundColor: 'red',
    height: '300',
    borderBottomWidth: theme.borderThin,
    borderBottomColor: theme.colors.border, // theme.colors.primary,
  },
  toggleButtonRow: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleButton: {
    flex: 1,
    borderWidth: theme.borderDefault,
    borderColor: theme.colors.border,
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: theme.borderDefault,
    borderBottomColor: theme.colors.primary,
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

export default styles;
