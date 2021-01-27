import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    flexDirection: 'column',
  },
  preview: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    top: 0,
  },
  buttonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  capture: {
    flex: 0,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 40,
    margin: 20,
    // padding: 15,
    paddingVertical: 25,
    paddingHorizontal: 25,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  captureInner: {
    flex: 0,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0)',
    borderRadius: 40,
    // margin: 20,
    // padding: 15,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  circle: {
    alignItems: 'center',
    borderWidth: 0.7,
    backgroundColor: 'rgba(1,1,1,0)',
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 25,
    bottom: 36,
    height: 40,
    color: 'red',
    alignSelf: 'center',
    justifyContent: 'center',
    left: 80,
    position: 'absolute',
    width: 40,
  },
  count: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.70)',
  },
  close: {
    alignItems: 'center',
    borderWidth: 0.3,
    backgroundColor: 'rgba(1,1,1,0)',
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 25,
    top: 15,
    height: 40,
    color: 'red',
    justifyContent: 'center',
    left: 20,
    position: 'absolute',
    width: 40,
  },
  closeIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    position: 'relative',
    marginTop: -5,
    color: 'rgba(255,255,255,0.70)',
    transform: [{rotateY: '180deg'}],
  },
});

export default styles;
