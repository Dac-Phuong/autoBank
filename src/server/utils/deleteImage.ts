export const deleteImage = async (path: string): Promise<void> => {
  try {
    if (fs.existsSync(path)) {
      await fs.promises.unlink(path);
    }
  } catch (error) {
    console.error(error);
  }
};
