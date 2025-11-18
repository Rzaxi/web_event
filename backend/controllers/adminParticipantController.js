const { EventRegistration, User, Event } = require('../models');

// Update registration status
const updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid. Harus pending, confirmed, atau cancelled'
      });
    }

    const registration = await EventRegistration.findByPk(id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registrasi tidak ditemukan'
      });
    }

    await registration.update({ status });

    res.json({
      success: true,
      message: `Status registrasi berhasil diubah menjadi ${status}`,
      registration
    });

  } catch (error) {
    console.error('Update registration status error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Bulk update registration status
const bulkUpdateStatus = async (req, res) => {
  try {
    const { registrationIds, status } = req.body;

    if (!Array.isArray(registrationIds) || registrationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'ID registrasi harus berupa array dan tidak boleh kosong'
      });
    }

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }

    const updatedCount = await EventRegistration.update(
      { status },
      {
        where: {
          id: registrationIds
        }
      }
    );

    res.json({
      success: true,
      message: `${updatedCount[0]} registrasi berhasil diupdate`,
      updatedCount: updatedCount[0]
    });

  } catch (error) {
    console.error('Bulk update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

module.exports = {
  updateRegistrationStatus,
  bulkUpdateStatus
};
