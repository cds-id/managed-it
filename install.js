const inquirer = require('inquirer');
const { execSync } = require('child_process');
const fs = require('fs');
const mysql = require('mysql2/promise');

async function runInstaller() {
  console.log('Welcome to Managed IT Installation Wizard\n');

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'dbHost',
      message: 'Database host:',
      default: 'localhost'
    },
    {
      type: 'input',
      name: 'dbPort',
      message: 'Database port:',
      default: '3306'
    },
    {
      type: 'input',
      name: 'dbName',
      message: 'Database name:',
      default: 'managed_it'
    },
    {
      type: 'input',
      name: 'dbUser',
      message: 'Database username:',
      default: 'root'
    },
    {
      type: 'password',
      name: 'dbPassword',
      message: 'Database password:'
    },
    {
      type: 'list',
      name: 'uploadProvider',
      message: 'Select upload provider:',
      choices: ['local', 'oss']
    },
    {
      type: 'input',
      name: 'companyName',
      message: 'Company name:'
    },
    {
      type: 'input',
      name: 'companyEmail',
      message: 'Company email:'
    },
    {
      type: 'list',
      name: 'defaultLanguage',
      message: 'Select default language:',
      choices: ['ID', 'EN']
    }
  ]);

  // Additional OSS questions if OSS selected
  if (answers.uploadProvider === 'oss') {
    const ossAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'ossRegion',
        message: 'OSS Region:'
      },
      {
        type: 'input',
        name: 'ossKeyId',
        message: 'OSS Access Key ID:'
      },
      {
        type: 'password',
        name: 'ossKeySecret',
        message: 'OSS Access Key Secret:'
      },
      {
        type: 'input',
        name: 'ossBucket',
        message: 'OSS Bucket:'
      }
    ]);
    Object.assign(answers, ossAnswers);
  }

  // Create database
  try {
    const connection = await mysql.createConnection({
      host: answers.dbHost,
      port: answers.dbPort,
      user: answers.dbUser,
      password: answers.dbPassword
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${answers.dbName}`);
    console.log('\n✅ Database created successfully');

    await connection.end();
  } catch (error) {
    console.error('❌ Database creation failed:', error);
    process.exit(1);
  }

  // Generate .env file
  const envContent = `
DATABASE_URL="mysql://${answers.dbUser}:${answers.dbPassword}@${answers.dbHost}:${answers.dbPort}/${answers.dbName}"
SESSION_SECRET_KEY="${Buffer.from(Math.random().toString()).toString('base64')}"
UPLOAD_PROVIDER=${answers.uploadProvider}
COMPANY_NAME="${answers.companyName}"
COMPANY_EMAIL="${answers.companyEmail}"
REPORT_LANGUAGE=${answers.defaultLanguage}
${answers.uploadProvider === 'oss' ? `
OSS_REGION=${answers.ossRegion}
OSS_ACCESS_KEY_ID=${answers.ossKeyId}
OSS_ACCESS_KEY_SECRET=${answers.ossKeySecret}
OSS_BUCKET=${answers.ossBucket}
` : ''}
`;

  fs.writeFileSync('.env', envContent);
  console.log('✅ Environment file created');

  // Run database migrations
  try {
    execSync('npm run db:migrate', { stdio: 'inherit' });
    console.log('✅ Database migrations completed');
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    process.exit(1);
  }

  // Run seeds
  try {
    execSync('npm run db:seed', { stdio: 'inherit' });
    console.log('✅ Database seeding completed');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }

  console.log('\n🎉 Installation completed successfully!');
  console.log('\nYou can now start the application:');
  console.log('\n  Development: npm run dev');
  console.log('  Production: npm run build && npm start');
}

runInstaller().catch(console.error);
