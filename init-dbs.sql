-- Create the second database since docker only creates one from POSTGRES_DB natively
CREATE DATABASE aethercrm;
GRANT ALL PRIVILEGES ON DATABASE aethercrm TO aether_admin;
