import requests
import os
import json
import boto3
from time import sleep

storageToken = 'yourToken'
# Source filename (including path)
fileName = 'simple.csv'
# Target Storage Bucket (assumed to exist)
bucketName = 'in.c-main'
# Target Storage Table (assumed NOT to exist)
tableName = 'my-new-table'

print('\nCreating upload file')

# Create a new file in Storage
# See https://keboola.docs.apiary.io/#reference/files/upload-file
response = requests.post(
    'https://connection.keboola.com/v2/storage/files/prepare?federationToken=1',
    data={
        'name': fileName,
        'sizeBytes': os.stat(fileName).st_size
    },
    headers={'X-StorageApi-Token': storageToken}
)
parsed = json.loads(response.content.decode('utf-8'))
# print(response.request.body)
# print(json.dumps(parsed, indent=4))

# Get AWS Credentials
accessKeyId = parsed['uploadParams']['credentials']['AccessKeyId']
accessKeySecret = parsed['uploadParams']['credentials']['SecretAccessKey']
sessionToken = parsed['uploadParams']['credentials']['SessionToken']
region = parsed['region']
fileId = parsed['id']

print('\nUploading to S3')

# Upload file to S3
# See https://boto3.amazonaws.com/v1/documentation/api/latest/guide/configuration.html
s3 = boto3.resource('s3', region_name=region, aws_access_key_id=accessKeyId, aws_secret_access_key=accessKeySecret, aws_session_token=sessionToken)
data = open(fileName, 'rb')
s3.Bucket(parsed['uploadParams']['bucket']).put_object(Key=parsed['uploadParams']['key'], Body=data)

print('\nCreating table')

# Load data from file into the Storage table
# See https://keboola.docs.apiary.io/#reference/tables/create-table-asynchronously/create-new-table-from-csv-file-asynchronously
response = requests.post(
    'https://connection.keboola.com/v2/storage/buckets/%s/tables-async' % bucketName,
    data={'name': tableName, 'dataFileId': fileId, 'delimiter': ',', 'enclosure': '"'},
    headers={'X-StorageApi-Token': storageToken},
)
parsed = json.loads(response.content.decode('utf-8'))
# print(json.dumps(parsed, indent=4))
if (parsed['status'] == 'error'):
    print(parsed['error'])
    exit(2)

status = parsed['status']
while (status == 'waiting') or (status == 'processing'):
    print('\nWaiting for import to finish')
    # See https://keboola.docs.apiary.io/#reference/jobs/manage-jobs/job-detail
    response = requests.get(parsed['url'], headers={'X-StorageApi-Token': storageToken})
    jobParsed = json.loads(response.content.decode('utf-8'))
    status = jobParsed['status']
    sleep(1)

# print(json.dumps(jobParsed, indent=4))
if (jobParsed['status'] == 'error'):
    print(jobParsed['error']['message'])
    exit(2)
