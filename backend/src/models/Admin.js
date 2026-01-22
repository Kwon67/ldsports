const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password antes de salvar
adminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar senha
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Método estático para criar/atualizar admins iniciais
adminSchema.statics.seedAdmins = async function () {
  const admins = [
    { username: 'kwon', password: '251636', displayName: 'Kwon' },
    { username: 'elder', password: '1234', displayName: 'Elder' },
  ];

  for (const adminData of admins) {
    const existingAdmin = await this.findOne({ username: adminData.username });

    if (!existingAdmin) {
      // Criar novo admin (pre-save hook fará o hash)
      await this.create(adminData);
      console.log(`Admin '${adminData.username}' criado com sucesso`);
    } else {
      // SEMPRE atualizar a senha para garantir sincronização
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);
      await this.updateOne(
        { _id: existingAdmin._id },
        { 
          $set: { 
            password: hashedPassword, 
            displayName: adminData.displayName, 
            isActive: true 
          } 
        }
      );
      console.log(`Admin '${adminData.username}' senha sincronizada`);
    }
  }
};

module.exports = mongoose.model('Admin', adminSchema);
