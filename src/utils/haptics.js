import * as Haptics from 'expo-haptics';

export const HapticPatterns = {
    light: 'light',
    medium: 'medium',
    heavy: 'heavy',
    success: 'success',
    error: 'error',
    warning: 'warning'
};

export const triggerHaptic = async (pattern) => {
    try {
        switch (pattern) {
            case 'light':
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                break;
            case 'medium':
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                break;
            case 'heavy':
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                break;
            case 'success':
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                break;
            case 'error':
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                break;
            case 'warning':
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                break;
            default:
                await Haptics.selectionAsync();
        }
    } catch (error) {
        console.warn('Haptics not supported');
    }
};
